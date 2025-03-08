import { FaCheck } from "react-icons/fa";

const Stepper = ({ steps, currentStep }) => {

    return (
        <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
            {steps.map((step, index) => {
                const isActive = index + 1 === currentStep;
                const isCompleted = index + 1 < currentStep;
                return (
                    <li
                        key={index}
                        className={`flex items-center space-x-2.5 rtl:space-x-reverse ${
                            isCompleted
                                ? "text-green-600 dark:text-green-500"
                                : isActive
                                ? "text-blue-600 dark:text-blue-500"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        <span
                            className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${
                                isCompleted
                                    ? "border-green-600 dark:border-green-500"
                                    : isActive
                                    ? "border-blue-600 dark:border-blue-500"
                                    : "border-gray-500 dark:border-gray-400"
                            }`}
                        >
                            {isCompleted ? <FaCheck /> : index + 1}
                        </span>
                        <span>
                            <h3 className="font-medium leading-tight">{step.title}</h3>
                            <p className="text-sm">{step.details}</p>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
};

export default Stepper;
