import { Page } from '@/components/page'
import { Toolbar } from '@/components/toolbar'

import { CategoryList } from './_components/category-list'
import { CreateCategoryForm } from './_components/create-category-form'

export default async function CategoriesPage() {
  return (
    <Page.Root>
      <Page.Content>
        <Toolbar.Root>
          <Toolbar.Content>
            <Page.Header className="gap-0">
              <Page.Title>Categories</Page.Title>
              <Page.Description>
                Categories are used to organize your expenses, income and
                investments.
              </Page.Description>
            </Page.Header>

            <CreateCategoryForm />
          </Toolbar.Content>
        </Toolbar.Root>

        <CategoryList />
      </Page.Content>
    </Page.Root>
  )
}
