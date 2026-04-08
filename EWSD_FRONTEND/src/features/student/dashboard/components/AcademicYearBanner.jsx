import { Card, CardBody, Chip } from "@heroui/react"
import { formatDate } from "../../../../utils/helpers"

export const AcademicYearBanner = ({ academicYear }) => {
    
    if (!academicYear) {
        return (
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardBody className="p-6">
                    <h2 className="text-2xl font-bold">Academic Year</h2>
                    <p className="text-white/80">No active academic year</p>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardBody className="flex flex-row items-center justify-between gap-4 p-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">{academicYear.name || "Academic Year"}</h2>
                    <div className="flex flex-wrap gap-2">
                        <Chip size="sm" variant="flat" className="bg-white/20 text-white">
                            Closure: {formatDate(academicYear.closure_date)}
                        </Chip>
                        <Chip size="sm" variant="flat" className="bg-white/20 text-white">
                            Final: {formatDate(academicYear.final_closure_date)}
                        </Chip>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
