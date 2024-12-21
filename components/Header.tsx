import Link from 'next/link';
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  coins: number
}

export function Header({ coins }: HeaderProps) {
  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex items-center gap-2">
        <span className="font-semibold">🪙 {coins}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/">홈</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/shop">상점</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

