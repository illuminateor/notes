import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Folder, HardDrive, LayoutGrid, Plus } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SidebarGroup, SidebarGroupLabel } from './ui/sidebar';

const mainNavItems: NavItem[] = [
    {
        title: 'All Notes',
        href: '/notes',
        icon: LayoutGrid,
    },
    {
        title: 'Create Note',
        href: '/notes/create',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [];

type PageProps = {
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    workspaces: { id: number; name: string }[];
};

export function AppSidebar() {
    const { categories, tags, workspaces } = usePage<PageProps>().props;
    const [showNewWorkspaceInput, setShowNewWorkspaceInput] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ name: '' });

    const categoryNavItems: NavItem[] = categories.map((category) => ({
        title: `${category.name}`,
        href: `/notes?category=${category.id}`,
        icon: Folder,
    }));

    const tagNavItems: NavItem[] = tags.map((tag) => ({
        title: `${tag.name}`,
        href: `/notes?tag=${tag.id}`,
        icon: BookOpen,
    }));

    const workspaceNavItems: NavItem[] = workspaces.map((workspace) => ({
        title: `${workspace.name}`,
        href: `/notes?workspace=${workspace.id}`,
        icon: HardDrive,
    }));

    const handleSaveWorkspace = () => {
        post(route('workspaces.store'), {
            onSuccess: () => {
                setShowNewWorkspaceInput(false);
                reset();
            },
        });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/notes" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                <SidebarGroup className="px-2 py-0">
                    <div className="flex items-center justify-between">
                        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
                        <Button variant="ghost" size="icon" onClick={() => setShowNewWorkspaceInput(!showNewWorkspaceInput)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {showNewWorkspaceInput && (
                        <div className="flex gap-2 p-2">
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="New Workspace"
                                disabled={processing}
                            />
                            <Button onClick={handleSaveWorkspace} disabled={processing}>
                                Save
                            </Button>
                        </div>
                    )}
                    <NavMain items={workspaceNavItems} />
                </SidebarGroup>

                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <NavMain items={categoryNavItems} />
                </SidebarGroup>

                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Tags</SidebarGroupLabel>
                    <NavMain items={tagNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
