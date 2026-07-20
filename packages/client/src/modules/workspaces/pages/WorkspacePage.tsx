import { useParams } from "react-router";

export const WorkspacePage = () => {
  const { workspaceId } = useParams();

  return (
    <>
      {workspaceId}
    </>
  );
};
