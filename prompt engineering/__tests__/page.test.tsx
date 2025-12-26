import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock components that might cause issues in Jest environment (like framer-motion)
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        header: ({ children, className }: any) => <header className={className}>{children}</header>,
        button: ({ children, onClick, className }: any) => <button onClick={onClick} className={className}>{children}</button>,
    },
    useScroll: () => ({
        scrollY: {
            on: jest.fn().mockReturnValue(() => {}) // Return unsubscribe fn
        }
    }),
    useTransform: () => 0,
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => '/',
}))

describe('Home Page', () => {
    it('renders the main title', () => {
        render(<Home />)
        const heading = screen.getByText('Prompt')
        expect(heading).toBeInTheDocument()
    })
})
