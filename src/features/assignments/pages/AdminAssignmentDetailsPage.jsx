import { useParams } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export default function AdminAssignmentDetailsPage() {
    const { assignmentId } = useParams({ strict: false });
    return (
        <PlaceholderPage
            title={`Assignment ${assignmentId}`}
            description="Full assignment editor lands in Milestone 5."
        />
    );
}