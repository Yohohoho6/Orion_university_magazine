import { Button } from "@heroui/react"
import { FiPlus, FiList } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

export const ActionButtons = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-wrap gap-3 justify-end">
            <Button
                color="default"
                variant="bordered"
                startContent={<FiList />}
                onPress={() => navigate("/student/my-contributions")}
            >
                My Contributions
            </Button>
            <Button
                color="primary"
                startContent={<FiPlus />}
                onPress={() => navigate("/student/submit-contribution")}
            >
                Submit Contribution
            </Button>
        </div>
    )
}
