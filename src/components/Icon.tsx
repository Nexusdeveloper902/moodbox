// Icons exported from the Penpot "Ícono · *" components (stroke icons, currentColor).
const ICONS = {
  check: [18, <path key="p" d="M3.75,9.38L7.5,12.75L14.25,5.25" strokeWidth="2.4" />],
  gift: [14, <><rect x="2.33" y="5.25" width="9.33" height="6.42" rx="2" strokeWidth="2" /><path d="M1.75,5.25L12.25,5.25M7,5.25L7,11.67M7,5.25C5.25,1.75,2.92,2.92,4.38,4.96M7,5.25C8.75,1.75,11.08,2.92,9.63,4.96" strokeWidth="2" /></>],
  truck: [14, <><path d="M1.75,3.5L8.17,3.5L8.17,9.33L1.75,9.33L1.75,3.5M8.17,5.83L10.5,5.83L12.25,7.58L12.25,9.33L8.17,9.33" strokeWidth="2" /><circle cx="4.08" cy="10.21" r="1.05" fill="currentColor" stroke="none" /><circle cx="9.92" cy="10.21" r="1.05" fill="currentColor" stroke="none" /></>],
  sparkle: [14, <path key="p" d="M7,1.17C7.58,5.25,8.75,6.42,12.83,7C8.75,7.58,7.58,8.75,7,12.83C6.42,8.75,5.25,7.58,1.17,7C5.25,6.42,6.42,5.25,7,1.17Z" fill="currentColor" stroke="none" />],
  minus: [16, <path key="p" d="M3.33,8L12.67,8" strokeWidth="2.2" />],
  plus: [16, <path key="p" d="M8,3.33L8,12.67M3.33,8L12.67,8" strokeWidth="2.2" />],
  alert: [20, <><circle cx="10" cy="10" r="7.5" strokeWidth="2" /><path d="M10,6.25L10,10.83M10,13.58L10,13.75" strokeWidth="2.4" /></>],
  pen: [18, <path key="p" d="M3.75,14.25L4.5,11.25L12,3.75L14.25,6L6.75,13.5L3.75,14.25M10.5,5.25L12.75,7.5" strokeWidth="2" />],
  arrow: [16, <path key="p" d="M3.33,8L12.67,8M8.67,4L12.67,8L8.67,12" strokeWidth="2.2" />],
  back: [18, <path key="p" d="M14.25,9L3.75,9M8.25,4.5L3.75,9L8.25,13.5" strokeWidth="2.2" />],
  chevron: [16, <path key="p" d="M6,4L10,8L6,12" strokeWidth="2.2" />],
  trash: [16, <path key="p" d="M3.33,4.67L12.67,4.67M6.67,4.67L6.67,3L9.33,3L9.33,4.67M4.67,4.67L5.33,13.33L10.67,13.33L11.33,4.67" strokeWidth="2" />],
  close: [22, <path key="p" d="M5.5,5.5L16.5,16.5M16.5,5.5L5.5,16.5" strokeWidth="2" />],
  cart: [22, <><path d="M2.75,3.67L5.5,3.67L7.79,13.75L16.5,13.75L18.79,6.42L6.42,6.42" strokeWidth="2" /><circle cx="8.71" cy="17.42" r="1.47" fill="currentColor" stroke="none" /><circle cx="15.58" cy="17.42" r="1.47" fill="currentColor" stroke="none" /></>],
  user: [18, <><circle cx="9" cy="6" r="3" strokeWidth="2" /><path d="M3,15C3.75,11.25,6.75,10.5,9,10.5C11.25,10.5,14.25,11.25,15,15" strokeWidth="2" /></>],
  menu: [22, <path key="p" d="M3.67,6.42L18.33,6.42M3.67,11L18.33,11M3.67,15.58L12.83,15.58" strokeWidth="2" />],
  heart: [18, <path key="p" d="M9,15C3,10.5,2.25,6.75,4.13,4.88C6,3,8.25,4.13,9,5.63C9.75,4.13,12,3,13.88,4.88C15.75,6.75,15,10.5,9,15Z" fill="currentColor" stroke="none" />],
  box: [64, <path key="p" d="M10.67,21.33L32,10.67L53.33,21.33L53.33,45.33L32,56L10.67,45.33L10.67,21.33M10.67,21.33L32,32L53.33,21.33M32,32L32,56" strokeWidth="4" />],
  lock: [18, <><rect x="3.75" y="8.25" width="10.5" height="6.75" rx="2" strokeWidth="2" /><path d="M6,8.25L6,6C6,3,12,3,12,6L12,8.25" strokeWidth="2" /></>],
  logout: [20, <path key="p" d="M8.33,4.17L4.17,4.17L4.17,15.83L8.33,15.83M12.5,6.67L15.83,10L12.5,13.33M15.83,10L7.5,10" strokeWidth="2" />],
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size, className }: { name: IconName; size?: number; className?: string }) {
  const [box, body] = ICONS[name];
  return (
    <svg viewBox={`0 0 ${box} ${box}`} width={size ?? box} height={size ?? box} className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {body}
    </svg>
  );
}
