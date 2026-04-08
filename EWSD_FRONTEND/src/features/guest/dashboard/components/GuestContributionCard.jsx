import { Card, CardHeader, CardBody, CardFooter, Chip, Avatar, Tooltip } from "@heroui/react";
import {
    LuDownload,
    LuEye,
    LuCalendar,
    LuFolder,
    LuUser,
} from "react-icons/lu";
import { formatDate } from "@/utils/helpers";
import { ContributionService } from "@/api/services/contribution-service";
import { toast } from "react-toastify";
import defaultCoverPhoto from "../../../../../public/default-cover-image.jpg";

const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
};

export function GuestContributionCard({ contribution, onDetailClick }) {
    const hasCoverPhoto = contribution?.cover_photo_path;
    const coverPhotoSrc = hasCoverPhoto
        ? `http://localhost:8000/storage/${contribution.cover_photo_path}`
        : defaultCoverPhoto;

    const handleDownload = async (e) => {
        e.stopPropagation();
        try {
            const blob = await ContributionService.downloadContribution(contribution.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            const fileName = contribution.file_url?.split("/").pop() || `contribution-${contribution.id}`;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Download started");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download file. Please try again.");
        }
    };

    return (
        <Card
            className="hover:shadow-xl transition-all duration-300 border border-default-100 cursor-pointer group"
            isPressable
            onPress={() => onDetailClick?.(contribution)}
        >
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                <img
                    alt={contribution?.title || "Cover photo"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={coverPhotoSrc}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute top-3 right-3 flex gap-2">
                    <Tooltip content="View details">
                        <Avatar
                            icon={<LuEye className="text-white" />}
                            size="sm"
                            className="cursor-pointer bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDetailClick?.(contribution);
                            }}
                        />
                    </Tooltip>
                    <Tooltip content="Download">
                        <Avatar
                            icon={<LuDownload className="text-white" />}
                            size="sm"
                            className="cursor-pointer bg-primary/80 hover:bg-primary backdrop-blur-sm transition-colors"
                            onClick={handleDownload}
                        />
                    </Tooltip>
                </div>

                <div className="absolute bottom-3 left-3">
                    
                </div>
            </div>

            <CardHeader className="flex flex-col items-start gap-1 py-3 px-4">
                <div className="flex flex-row gap-2">
                    <p className="text-base font-bold text-default-900 line-clamp-2">
                        {contribution?.title}
                    </p>
                    <Chip
                            size="sm"
                            variant="flat"
                            color="primary"
                            classNames={{
                                content: "text-xs font-medium font-bold",
                            }}
                        >
                            {contribution?.category?.name}
                    </Chip>
                </div>
            </CardHeader>

            <CardBody className="py-1 px-4">
                <p className="text-default-600 text-sm leading-relaxed line-clamp-2">
                    {truncateText(contribution?.description)}
                </p>
            </CardBody>

            <CardFooter className="flex justify-between items-center py-3 px-4 bg-default-50/50 rounded-b-xl">
                <div className="flex items-center gap-1 text-default-500">
                    <LuUser size={14} />
                    <span className="text-xs font-medium">{contribution?.user?.name}</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-default-500">
                        <LuCalendar size={14} />
                        <span className="text-xs">
                            {formatDate(contribution?.created_at)}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
