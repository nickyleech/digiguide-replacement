import { X } from 'lucide-react'

interface ChannelDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  channel: any
  onEdit?: () => void
}

export default function ChannelDetailsModal({ isOpen, onClose, channel, onEdit }: ChannelDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Channel Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Name:</strong> {channel?.name || 'N/A'}</p>
          <p><strong>Category:</strong> {channel?.category || 'N/A'}</p>
          <p><strong>Status:</strong> {channel?.status || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}