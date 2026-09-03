import { Test, TestingModule } from "@nestjs/testing";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";
import { ThrottlerGuard } from "@nestjs/throttler";
import request from "supertest";
import { AppModule } from "../src/modules/app/app.module.js";
import { PrismaService } from "../src/modules/prisma/prisma.service.js";

describe("Security regression suite (e2e)", () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET ?? "test-cookie-secret",
    });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  }, 15000);

  async function registerAndLogin(email: string) {
    const registerRes = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password: "TestPass123!",
        firstName: "Test",
        lastName: "User",
      });

    if (registerRes.status >= 400) {
      console.log(
        `[register ${email}] status=${registerRes.status}`,
        registerRes.body,
      );
    }

    const res = await request(app.getHttpServer()).post("/auth/login").send({
      email,
      password: "TestPass123!",
    });

    if (res.status >= 400) {
      console.log(`[login ${email}] status=${res.status}`, res.body);
    }

    const cookies = res.headers["set-cookie"] as unknown as string[];
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    return { userId: user.id, cookies };
  }

  async function createWorkspaceViaApi(ownerCookies: string[], name: string) {
    const res = await request(app.getHttpServer())
      .post("/workspaces")
      .set("Cookie", ownerCookies)
      .send({ name, description: "test workspace" });

    return res.body.id as string;
  }

  async function addParticipant(
    workspaceId: string,
    userId: string,
    role: "MANAGER" | "MEMBER" | "OWNER",
  ) {
    return prisma.workspaceParticipant.create({
      data: { workspaceId, userId, role },
    });
  }

  it("user A cannot see user B's personal (workspace-less) todo", async () => {
    const userA = await registerAndLogin("userA-personal-todo@test.com");
    const userB = await registerAndLogin("userB-personal-todo@test.com");

    const todo = await prisma.todo.create({
      data: {
        title: "B's private todo",
        description: "",
        userId: userB.userId,
      },
    });

    const res = await request(app.getHttpServer())
      .get("/todos?limit=20")
      .set("Cookie", userA.cookies);

    expect(res.status).toBe(200);
    const ids = res.body.items.map((t: any) => t.id);
    expect(ids).not.toContain(todo.id);
  });

  it("non-member cannot see another workspace's todos via GET /todos", async () => {
    const owner = await registerAndLogin("owner-ws-todo@test.com");
    const outsider = await registerAndLogin("outsider-ws-todo@test.com");

    const workspaceId = await createWorkspaceViaApi(
      owner.cookies,
      "WS Todo Test",
    );

    const todo = await prisma.todo.create({
      data: {
        title: "workspace todo",
        description: "",
        userId: owner.userId,
        workspaceId,
      },
    });

    const res = await request(app.getHttpServer())
      .get("/todos?limit=20")
      .set("Cookie", outsider.cookies);

    expect(res.status).toBe(200);
    const ids = res.body.items.map((t: any) => t.id);
    expect(ids).not.toContain(todo.id);
  });

  it("regular member cannot transfer workspace ownership", async () => {
    const owner = await registerAndLogin("owner-ws-transfer@test.com");
    const member = await registerAndLogin("member-ws-transfer@test.com");

    const workspaceId = await createWorkspaceViaApi(
      owner.cookies,
      "WS Transfer Test",
    );
    const memberParticipant = await addParticipant(
      workspaceId,
      member.userId,
      "MEMBER",
    );

    const res = await request(app.getHttpServer())
      .patch(
        `/workspaces/${workspaceId}/participants/${memberParticipant.id}/transfer-ownership`,
      )
      .set("Cookie", member.cookies);

    expect(res.status).toBe(403);

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    expect(workspace?.ownerId).not.toBe(memberParticipant.id);
  });

  it("manager cannot kick the owner", async () => {
    const owner = await registerAndLogin("owner-kick-test@test.com");
    const manager = await registerAndLogin("manager-kick-test@test.com");

    const workspaceId = await createWorkspaceViaApi(
      owner.cookies,
      "WS Kick Owner Test",
    );
    await addParticipant(workspaceId, manager.userId, "MANAGER");

    const ownerParticipant = await prisma.workspaceParticipant.findFirstOrThrow(
      {
        where: { workspaceId, userId: owner.userId },
      },
    );

    const res = await request(app.getHttpServer())
      .delete(
        `/workspaces/${workspaceId}/participants/${ownerParticipant.id}/kick`,
      )
      .set("Cookie", manager.cookies);

    expect(res.status).toBe(400);

    const stillMember = await prisma.workspaceParticipant.findFirst({
      where: { workspaceId, userId: owner.userId },
    });
    expect(stillMember).not.toBeNull();
  });

  it("anonymous request cannot call participants/kick", async () => {
    const owner = await registerAndLogin("owner-anon-kick@test.com");
    const victim = await registerAndLogin("victim-anon-kick@test.com");

    const workspaceId = await createWorkspaceViaApi(
      owner.cookies,
      "WS Anon Kick Test",
    );
    const victimParticipant = await addParticipant(
      workspaceId,
      victim.userId,
      "MEMBER",
    );

    const res = await request(app.getHttpServer()).delete(
      `/workspaces/${workspaceId}/participants/${victimParticipant.id}/kick`,
    );

    expect(res.status).toBe(401);

    const stillMember = await prisma.workspaceParticipant.findFirst({
      where: { workspaceId, userId: victim.userId },
    });
    expect(stillMember).not.toBeNull();
  });

  it("manager workspace A cannot get chat from workspace B (403/404, not data)", async () => {
    // Workspace A + manager
    const managerA = await registerAndLogin("manager-a-chat@test.com");
    const workspaceA = await createWorkspaceViaApi(
      managerA.cookies,
      "WS A Chat Test",
    );
    await addParticipant(workspaceA, managerA.userId, "MANAGER");

    const ownerB = await registerAndLogin("owner-b-chat@test.com");
    const workspaceB = await createWorkspaceViaApi(
      ownerB.cookies,
      "WS B Chat Test",
    );

    const chatB = await prisma.chat.create({
      data: {
        workspaceId: workspaceB,
        name: "Secret chat in workspace B",
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/chats/${chatB.id}`)
      .set("Cookie", managerA.cookies);

    expect([403, 404]).toContain(res.status);
    expect(res.body?.title).not.toBe("Secret chat in workspace B");
  });

  it("member of workspace A cannot read a chat in workspace B", async () => {
    const ownerA = await registerAndLogin("ownerA-chat-cross@test.com");
    const ownerB = await registerAndLogin("ownerB-chat-cross@test.com");

    await createWorkspaceViaApi(ownerA.cookies, "WS A Chat Test");
    const workspaceB = await createWorkspaceViaApi(
      ownerB.cookies,
      "WS B Chat Test",
    );

    const chat = await prisma.chat.create({
      data: { name: "B's chat", workspaceId: workspaceB },
    });

    const res = await request(app.getHttpServer())
      .get(`/workspaces/${workspaceB}/chats/${chat.id}`)
      .set("Cookie", ownerA.cookies);

    expect(res.status).toBe(403);
  });

  it("user A cannot edit user B's chat message", async () => {
    const owner = await registerAndLogin("owner-msg-edit@test.com");
    const userA = await registerAndLogin("userA-msg-edit@test.com");
    const userB = await registerAndLogin("userB-msg-edit@test.com");

    const workspaceId = await createWorkspaceViaApi(
      owner.cookies,
      "WS Msg Edit Test",
    );
    await addParticipant(workspaceId, userA.userId, "MEMBER");
    await addParticipant(workspaceId, userB.userId, "MEMBER");

    const chat = await prisma.chat.create({
      data: { name: "shared chat", workspaceId },
    });
    const message = await prisma.chatMessage.create({
      data: { content: "original", chatId: chat.id, userId: userB.userId },
    });

    const res = await request(app.getHttpServer())
      .put(
        `/workspaces/${workspaceId}/chats/${chat.id}/chat-messages/${message.id}`,
      )
      .set("Cookie", userA.cookies)
      .send({ content: "hacked by A" });

    expect(res.status).not.toBe(200);

    const unchanged = await prisma.chatMessage.findUnique({
      where: { id: message.id },
    });
    expect(unchanged?.content).toBe("original");
  });

  it("user A cannot mark user B's notification as read", async () => {
    const userA = await registerAndLogin("userA-notif@test.com");
    const userB = await registerAndLogin("userB-notif@test.com");

    const notification = await prisma.notification.create({
      data: { userId: userB.userId, message: "test", read: false },
    });

    const res = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}/read`)
      .set("Cookie", userA.cookies);

    expect(res.status).not.toBe(200);

    const unchanged = await prisma.notification.findUnique({
      where: { id: notification.id },
    });
    expect(unchanged?.read).toBe(false);
  });

  it("websocket: non-member cannot join a foreign chat room", async () => {
    const { io } = await import("socket.io-client");

    const owner = await registerAndLogin("owner-ws-room@test.com");
    const outsider = await registerAndLogin("outsider-ws-room@test.com");

    const workspaceId = await createWorkspaceViaApi(
      owner.cookies,
      "WS Room Test",
    );
    const chat = await prisma.chat.create({
      data: { name: "private chat", workspaceId },
    });

    const address = await app.getUrl();
    const cookieHeader = outsider.cookies.join("; ");

    const socket = io(address, {
      transportOptions: {
        polling: { extraHeaders: { Cookie: cookieHeader } },
      },
    });

    await new Promise<void>((resolve, reject) => {
      socket.on("connect", () => resolve());
      socket.on("connect_error", (err) => reject(err));
    });

    const result = await new Promise((resolve) => {
      socket.on("exception", (err: any) => resolve(err));
      socket.emit("join-chat-room", { id: chat.id });
      setTimeout(() => resolve({ timedOutWithoutError: true }), 2000);
    });

    expect(JSON.stringify(result)).toMatch(/not a participant/i);

    socket.disconnect();
  });

  it("revoked refresh token cannot be used to refresh the session", async () => {
    const user = await registerAndLogin("revoked-refresh@test.com");

    await request(app.getHttpServer())
      .delete("/auth/logout")
      .set("Cookie", user.cookies);

    const res = await request(app.getHttpServer())
      .get("/token")
      .set("Cookie", user.cookies);

    expect(res.status).toBe(401);
  });
});
