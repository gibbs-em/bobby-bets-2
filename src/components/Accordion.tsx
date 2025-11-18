import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface AccordionProps {
  items: {
    title: string
    content: string
  }[]
}

export default function AccordionBlock({ items }: AccordionProps) {
  return (
    <Accordion type="single" collapsible>
        {items.map((item, index) => (
            <AccordionItem key={index} value={item.title}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  )
}