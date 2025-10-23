import Image from "next/image"

type Props = {
    question: string
}

export const QuestionBubble = ({ question }: Props) => {
    return( 
        <div className="flex items-center gap-x-4 mb-6">
            <Image src="/mascot.png" alt="Mascot" height={60} width={60} className="block lg:hidden"/>
            <Image src="/mascot.png" alt="Mascot" height={40} width={40} className="hidden lg:block"/>
            <div className="relative py-2 px-4 bg-orange-500 border-2 border-orange-600 rounded-xl text-white text-sm lg:text-base">
                {question}
                <div className="absolute -left-3 top-1/2 w-0 h-0 
                    border-y-8 border-y-transparent 
                    border-r-8 border-r-orange-500 
                    transform -translate-y-1/2" />
            </div>
        </div>
    )
}
