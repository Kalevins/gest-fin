import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'

import { SessionProvider } from "next-auth/react";
import Page from '@/pages/index'

import { Role } from '@prisma/client';
import { routesApp } from '@/lib/routes';

describe('Home Page', () => {
  test('Render Rol User Valido', () => {
    render(
      <SessionProvider session={{
        user: {
          name: 'Test User',
          email: '',
          role: Role.USER,
        },
        expires: ''
      }}
      >
        <Page />
      </SessionProvider>
    )

    const text = screen.getByText(routesApp[0].name)

    // Visible para todos los roles
    expect(text).toBeDefined()
  })

  test('Render Rol User Invalido', () => {
    render(
      <SessionProvider session={{
        user: {
          name: 'Test User',
          email: '',
          role: Role.USER,
        },
        expires: ''
      }}
      >
        <Page />
      </SessionProvider>
    )

    const text = screen.queryByText(routesApp[1].name)

    // Visible para Administador
    expect(text).toBeNull();
  })

  test('Render Rol Admin Valido', () => {
    render(
      <SessionProvider session={{
        user: {
          name: 'Test User',
          email: '',
          role: Role.ADMIN,
        },
        expires: ''
      }}
      >
        <Page />
      </SessionProvider>
    )

    const text = screen.getByText(routesApp[1].name)

    // Visible para Administador
    expect(text).toBeDefined()
  })
})