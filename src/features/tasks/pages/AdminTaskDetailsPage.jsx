import { useParams } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export default function AdminTaskDetailsPage() {
    const { taskId } = useParams({ strict: false });
    return (
        <PlaceholderPage
            title={`Task ${taskId}`}
            description="Full task details, dependencies, and resources land in Milestone 4."
        />
    );
}