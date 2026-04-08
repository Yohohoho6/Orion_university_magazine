import { Spinner } from "@heroui/react";
import { LuFileText } from "react-icons/lu";
import { useContributionById } from "@/features/student/contributions/hooks/useContributionById";

export function AISummary({ contributionId, showTitle = true }) {
  const { data: contributionDetail, isLoading } = useContributionById(contributionId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-default-500">
          <Spinner size="sm" />
          <span>Loading...</span>
        </div>
      );
    }

    if (!contributionDetail?.data?.summary) {
      return (
        <p className="text-default-400 italic">
          No summary available for this contribution.
        </p>
      );
    }

    const summary = contributionDetail.data.summary;

    if (summary === "Generating AI summary...") {
      return (
        <div className="flex items-center gap-2 text-default-500 italic">
          <Spinner size="sm" color="warning" />
          <span>Generating AI summary... Please check back in a moment.</span>
        </div>
      );
    }

    if (summary.startsWith("Unable to generate summary")) {
      return (
        <div className="text-danger-600 leading-relaxed">
          <p className="font-medium mb-1">Summary Unavailable</p>
          <p>{summary}</p>
        </div>
      );
    }

    return (
      <p className="text-default-600 leading-relaxed whitespace-pre-wrap">
        {summary}
      </p>
    );
  };

  return (
    <div className="mb-6">
      {showTitle && (
        <h3 className="text-sm font-semibold text-default-700 mb-2 flex items-center gap-2">
          <LuFileText className="w-4 h-4" />
          AI Summary
        </h3>
      )}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
        {renderContent()}
      </div>
    </div>
  );
}