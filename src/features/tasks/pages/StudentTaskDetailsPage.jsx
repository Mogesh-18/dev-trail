import { useParams } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export default function StudentTaskDetailsPage() {
    const { taskId } = useParams({ strict: false });
    return (
        <PlaceholderPage
            title={`Task ${taskId}`}
            description="Instructions, resources, and progress actions land in Milestone 7."
        />
    );
}