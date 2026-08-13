import { useParams } from "react-router";

const WorkspacePage = () => {
  const params = useParams();

  return <>{params.workspaceId}</>;
};

export default WorkspacePage;
