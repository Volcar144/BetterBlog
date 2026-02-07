'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Icon } from '../../icon';
import { useLayout } from '../layout-context';
import { BookOpen, Menu, Moon, Sun, X } from 'lucide-react';
import AlgoliaSearch from '@/components/algolia-search';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { globalSettings, theme } = useLayout();
  const header = globalSettings!.header!;
  const { resolvedTheme, setTheme } = useTheme();

  const [readingMode, setReadingMode] = React.useState(false);

  const [menuState, setMenuState] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem('reading-mode');
    if (stored !== null) {
      setReadingMode(stored === 'true');
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('reading-mode', readingMode);
    localStorage.setItem('reading-mode', readingMode ? 'true' : 'false');
  }, [readingMode]);

  const isDark = resolvedTheme === 'dark';

  return (
    <header>
      <nav data-state={menuState && 'active'} className='bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl'>
        <div className='mx-auto max-w-6xl px-6 transition-all duration-300'>
          <div className='relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4'>
            <div className='flex w-full items-center justify-between gap-12'>
              <Link href='/' aria-label='home' className='flex items-center space-x-2'>
                <Icon
                  parentColor={header.color!}
                  data={{
                    name: header.icon!.name,
                    color: header.icon!.color,
                    style: header.icon!.style,
                  }}
                />{' '}
                <span>{header.name}</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className='relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden'
              >
                <Menu className='in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200' />
                <X className='in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200' />
              </button>

              <div className='hidden lg:block'>
                <ul className='flex gap-8 text-sm'>
                  {header.nav!.map((item, index) => (
                    <li key={index}>
                      <Link href={item!.href!} className='text-muted-foreground hover:text-accent-foreground block duration-150'>
                        <span>{item!.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='hidden lg:block'>
                <AlgoliaSearch />
              </div>

              <div className='hidden lg:flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  aria-pressed={readingMode}
                  aria-label={readingMode ? 'Disable reading mode' : 'Enable reading mode'}
                  onClick={() => setReadingMode((prev) => !prev)}
                >
                  <BookOpen className={readingMode ? 'text-foreground' : 'text-muted-foreground'} />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                >
                  {isDark ? <Sun className='text-muted-foreground' /> : <Moon className='text-muted-foreground' />}
                </Button>
              </div>
            </div>

            <div className='bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent'>
              <div className='lg:hidden'>
                <ul className='space-y-6 text-base'>
                  {header.nav!.map((item, index) => (
                    <li key={index}>
                      <Link href={item!.href!} className='text-muted-foreground hover:text-accent-foreground block duration-150'>
                        <span>{item!.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='lg:hidden w-full'>
                <AlgoliaSearch />
              </div>

              <div className='lg:hidden flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  aria-pressed={readingMode}
                  aria-label={readingMode ? 'Disable reading mode' : 'Enable reading mode'}
                  onClick={() => setReadingMode((prev) => !prev)}
                >
                  <BookOpen className={readingMode ? 'text-foreground' : 'text-muted-foreground'} />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                >
                  {isDark ? <Sun className='text-muted-foreground' /> : <Moon className='text-muted-foreground' />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
