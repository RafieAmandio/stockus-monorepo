'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Template } from '@/lib/api/admin'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface ColumnsProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Template>[] => [
  {
    accessorKey: 'title',
    header: 'Judul',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.title}</div>
        {row.original.description && (
          <div className="text-sm text-muted-foreground line-clamp-1">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'originalFilename',
    header: 'File',
    cell: ({ row }) => (
      <span className="text-sm font-mono">{row.original.originalFilename}</span>
    ),
  },
  {
    accessorKey: 'fileSize',
    header: 'Ukuran',
    cell: ({ row }) => (
      <span className="text-sm">{formatFileSize(row.original.fileSize)}</span>
    ),
  },
  {
    accessorKey: 'isFreePreview',
    header: 'Akses',
    cell: ({ row }) => (
      <Badge variant={row.original.isFreePreview ? 'secondary' : 'default'}>
        {row.original.isFreePreview ? 'Gratis' : 'Member'}
      </Badge>
    ),
  },
  {
    accessorKey: 'downloadCount',
    header: 'Download',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.downloadCount}×</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.original.createdAt), 'dd MMM yyyy', { locale: localeId })}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(row.original.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
