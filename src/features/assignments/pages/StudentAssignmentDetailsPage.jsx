import { useParams } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export default function StudentAssignmentDetailsPage() {
    const { assignmentId } = useParams({ strict: false });
    return (
        <PlaceholderPage
            title={`Assignment ${assignmentId}`}
            description="Instructions, files, and submission land in Milestone 7."
        />
    );
}