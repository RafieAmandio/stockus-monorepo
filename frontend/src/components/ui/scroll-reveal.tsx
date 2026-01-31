'use client'

import { motion, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

type AnimationVariant = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fadeIn' | 'scale' | 'slideUp'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  once?: boolean
  amount?: number | 'some' | 'all'
}

const variants: Record<AnimationVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -60, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60, filter: 'blur(10px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60, filter: 'blur(10px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  fadeIn: {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  },
  slideUp: {
    hidden: { opacity: 0, y: 100, filter: 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
}

export function ScrollReveal({
  children,
  className,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.8,
  once = true,
  amount = 0.15,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier easing
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for animating children with delay
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode
  className?: string
  variant?: AnimationVariant
}

export function StaggerItem({
  children,
  className,
  variant = 'fadeUp',
}: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Parallax effect component
interface ParallaxProps {
  children: ReactNode
  className?: string
  speed?: number // 0 = no movement, 1 = full parallax
}

export function Parallax({
  children,
  className,
  speed = 0.5,
}: ParallaxProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      style={{
        willChange: 'transform',
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  )
}
