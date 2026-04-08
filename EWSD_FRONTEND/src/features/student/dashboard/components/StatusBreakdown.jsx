import { Card, CardBody, Chip } from "@heroui/react"
import { FiClock, FiMessageCircle, FiStar, FiXCircle } from "react-icons/fi"
import { STATUS_COLORS } from "../../../../utils/helpers"

// Static color mappings for Tailwind (required for proper tree-shaking)
const STATUS_ICON_BG_COLORS = {
    pending: "bg-yellow-100 dark:bg-yellow-900",
    commented: "bg-purple-100 dark:bg-purple-900",
    selected: "bg-green-100 dark:bg-green-900",
    rejected: "bg-red-100 dark:bg-red-900",
}

const STATUS_ICON_TEXT_COLORS = {
    pending: "text-yellow-600 dark:text-yellow-400",
    commented: "text-purple-600 dark:text-purple-400",
    selected: "text-green-600 dark:text-green-400",
    rejected: "text-red-600 dark:text-red-400",
}

// eslint-disable-next-line no-unused-vars
const StatusCard = ({ icon: Icon, label, count, status }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
            <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className={`p-3 rounded-full ${STATUS_ICON_BG_COLORS[status]}`}>
                    <Icon className={`text-2xl ${STATUS_ICON_TEXT_COLORS[status]}`} />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                    <p className="text-2xl font-bold dark:text-gray-100">{count}</p>
                </div>
                <Chip color={STATUS_COLORS[status]} variant="flat" size="sm">
                    {status}
                </Chip>
            </CardBody>
        </Card>
    )
}

export const StatusBreakdown = ({ breakdown }) => {
    // Ensure breakdown has default values
    const safeBreakdown = {
        pending: 0,
        commented: 0,
        selected: 0,
        rejected: 0,
        ...breakdown,
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusCard
                icon={FiClock}
                label="Pending Review"
                count={safeBreakdown.pending}
                status="pending"
            />
            <StatusCard
                icon={FiMessageCircle}
                label="Commented"
                count={safeBreakdown.commented}
                status="commented"
            />
            <StatusCard
                icon={FiStar}
                label="Selected"
                count={safeBreakdown.selected}
                status="selected"
            />
            <StatusCard
                icon={FiXCircle}
                label="Rejected"
                count={safeBreakdown.rejected}
                status="rejected"
            />
        </div>
    )
}
