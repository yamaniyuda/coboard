"use client"

import { RenameModal } from "@/components/modal/rename-modal"
import { useEffect, useState } from "react"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <RenameModal />
    </>
  )
}