import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Create Note',
        href: '/notes/create',
        icon: LayoutGrid,
    },
    {
        title: 'All Notes',
        href: '/notes',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

type PageProps = {
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
};

export function AppSidebar() {
    const { categories, tags } = usePage<PageProps>().props;
    const [mainNavItemsState, setMainNavItemsState] = useState<NavItem[]>(mainNavItems);

    useEffect(() => {
        const updatedItems = [
            ...mainNavItems,
            ...categories.map((category: { id: number; name: string }) => ({
                title: `Category: ${category.name}`,
                href: `/notes?category=${category.id}`,
                icon: Folder,
            })),
            ...tags.map((tag: { id: number; name: string }) => ({
                title: `Tag: ${tag.name}`,
                href: `/notes?tag=${tag.id}`,
                icon: BookOpen,
            })),
        ];
        setMainNavItemsState(updatedItems);
    }, [categories, tags]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItemsState} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
