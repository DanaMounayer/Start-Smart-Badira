/** Small brand mark: a sprout, echoing "badira" (a seed / an initiative). */
export function BadiraMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 21v-7"
        stroke="var(--c-brand-700)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z"
        fill="var(--c-brand-500)"
      />
      <path
        d="M12 16c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z"
        fill="var(--c-brand-700)"
      />
    </svg>
  )
}
