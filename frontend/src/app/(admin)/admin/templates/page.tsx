'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/DataTable'
import { createColumns } from './columns'
import { getAdminTemplates, deleteTemplate, Template } from '@/lib/api/admin'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      setLoading(true)
      const data = await getAdminTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(id: string) {
    router.push(`/admin/templates/${id}`)
  }

  function handleDelete(id: string) {
    setDeleteId(id)
  }

  async function confirmDelete() {
    if (!deleteId) return

    try {
      setDeleting(true)
      await deleteTemplate(deleteId)
      // Remove from local state
      setTemplates((prev) => prev.filter((t) => t.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Failed to delete template:', error)
      alert('Gagal menghapus template')
    } finally {
      setDeleting(false)
    }
  }

  const columns = createColumns({ onEdit: handleEdit, onDelete: handleDelete })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Template</h1>
        </div>
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Template</h1>
            <p className="text-muted-foreground">
              Kelola file template yang dapat diunduh member
            </p>
          </div>
          <Button onClick={() => router.push('/admin/templates/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Template
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={templates}
          searchKey="title"
          searchPlaceholder="Cari template..."
        />
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Template ini akan dihapus secara permanen. Member tidak akan dapat mengunduh
              template ini lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
