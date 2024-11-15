import {useEffect, useRef, useState} from 'react'
import './App.css'

type MenuItem = {
    id: string;
    label: string;
    link?: string;
    children?: MenuItem[];
};

const menuData: MenuItem[] = [
    {
        id: '1',
        label: 'Home',
        link: '/',
    },
    {
        id: '2',
        label: 'Products',
        children: [
            {
                id: '2-1',
                label: 'Electronics',
                children: [
                    {
                        id: '2-1-1',
                        label: 'Mobile Phones',
                        children: [
                            {
                                id: '2-1-1-1',
                                label: 'Smartphones',
                                link: '/products/electronics/phones/smartphones',
                            },
                            {
                                id: '2-1-1-2',
                                label: 'Feature Phones',
                                link: '/products/electronics/phones/feature-phones',
                            },
                        ],
                    },
                    {id: '2-1-2', label: 'Laptops', link: '/products/electronics/laptops'},
                    {
                        id: '2-1-3',
                        label: 'Notebooks',
                        children: [
                            {
                                id: '2-1-3-1',
                                label: 'Book',
                                link: '/products/electronics/phones/smartphones',
                            },
                            {
                                id: '2-1-3-2',
                                label: 'Diary',
                                link: '/products/electronics/phones/feature-phones',
                            },
                        ],
                    },
                ],
            },
            {id: '2-2', label: 'Furniture', link: '/products/furniture'},
        ],
    },
    {
        id: '3',
        label: 'About Us',
        link: '/about',
    },
];


interface MenuItemProps {
    item: MenuItem;
    depthLevel: number;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({item, depthLevel}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={ref} style={{position: 'relative', minWidth: '200px'}}>
            <div onClick={toggleOpen} style={{cursor: 'pointer', padding: '10px'}}>
                {item.label} {item.children && <span>{isOpen ? '▲' : '▼'}</span>}
            </div>

            {isOpen && item.children && (
                <div
                    style={{
                        position: 'absolute',
                        top: depthLevel === 1 ? '100%' : '0', // First level appears below, others to the right
                        left: depthLevel === 1 ? '0' : '100%', // First level aligns left, others shift right
                        marginTop: depthLevel === 1 ? '5px' : '0',
                        marginLeft: depthLevel === 1 ? '0' : '5px',
                        // backgroundColor: 'white',
                        // boxShadow: '0 0 2px rgba(0,0,0,0.15)',
                        zIndex: depthLevel,
                        minWidth: '200px',
                    }}
                >
                    {item.children.map((child) => (
                        <MenuItemComponent key={child.id} item={child} depthLevel={depthLevel + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface MenuProps {
    menuData: MenuItem[];
}

const DropdownMenu: React.FC<MenuProps> = ({menuData}) => {
    return (
        <div style={{display: 'flex'}}>
            {menuData.map((item) => (
                <MenuItemComponent key={item.id} item={item} depthLevel={1}/>
            ))}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <div>
            <h1>5-Level Dropdown Menu</h1>
            <DropdownMenu menuData={menuData}/>
        </div>
    );
};

export default App;
