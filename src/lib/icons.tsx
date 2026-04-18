import { forwardRef } from "react";
import {
  ArrowDown as PhosphorArrowDown,
  Archive as PhosphorArchive,
  ArrowCounterClockwise as PhosphorArrowCounterClockwise,
  ArrowLeft as PhosphorArrowLeft,
  ArrowRight as PhosphorArrowRight,
  ArrowSquareOut as PhosphorArrowSquareOut,
  BoxArrowDown as PhosphorBoxArrowDown,
  Bell as PhosphorBell,
  BookOpen as PhosphorBookOpen,
  Books as PhosphorBooks,
  Camera as PhosphorCamera,
  CaretDown as PhosphorCaretDown,
  CaretLeft as PhosphorCaretLeft,
  CaretRight as PhosphorCaretRight,
  CaretUp as PhosphorCaretUp,
  ChartBar as PhosphorChartBar,
  Check as PhosphorCheck,
  CheckCircle as PhosphorCheckCircle,
  Circle as PhosphorCircle,
  Clock as PhosphorClock,
  CurrencyCircleDollar as PhosphorCurrencyCircleDollar,
  CurrencyDollar as PhosphorCurrencyDollar,
  CloudArrowUp as PhosphorCloudArrowUp,
  Compass as PhosphorCompass,
  Confetti as PhosphorConfetti,
  Copy as PhosphorCopy,
  CreditCard as PhosphorCreditCard,
  CursorClick as PhosphorCursorClick,
  DotsSixVertical as PhosphorDotsSixVertical,
  DotsThree as PhosphorDotsThree,
  Download as PhosphorDownload,
  EnvelopeSimple as PhosphorEnvelopeSimple,
  Eye as PhosphorEye,
  FileCode as PhosphorFileCode,
  Flask as PhosphorFlask,
  Folder as PhosphorFolder,
  FilePlus as PhosphorFilePlus,
  FileText as PhosphorFileText,
  FloppyDisk as PhosphorFloppyDisk,
  Funnel as PhosphorFunnel,
  Gift as PhosphorGift,
  GlobeHemisphereWest as PhosphorGlobeHemisphereWest,
  Gauge as PhosphorGauge,
  Gear as PhosphorGear,
  Hash as PhosphorHash,
  House as PhosphorHouse,
  ImageSquare as PhosphorImageSquare,
  Info as PhosphorInfo,
  InstagramLogo as PhosphorInstagramLogo,
  Key as PhosphorKey,
  Lifebuoy as PhosphorLifebuoy,
  Lightbulb as PhosphorLightbulb,
  Link as PhosphorLink,
  LinkSimple as PhosphorLinkSimple,
  LinkedinLogo as PhosphorLinkedinLogo,
  List as PhosphorList,
  ListChecks as PhosphorListChecks,
  Lock as PhosphorLock,
  MagnifyingGlass as PhosphorMagnifyingGlass,
  MagnifyingGlassPlus as PhosphorMagnifyingGlassPlus,
  Monitor as PhosphorMonitor,
  Moon as PhosphorMoon,
  Minus as PhosphorMinus,
  NotePencil as PhosphorNotePencil,
  Package as PhosphorPackage,
  PencilSimple as PhosphorPencilSimple,
  Pulse as PhosphorPulse,
  Plus as PhosphorPlus,
  QrCode as PhosphorQrCode,
  Question as PhosphorQuestion,
  Receipt as PhosphorReceipt,
  RocketLaunch as PhosphorRocketLaunch,
  SealCheck as PhosphorSealCheck,
  ShieldCheck as PhosphorShieldCheck,
  ShoppingBag as PhosphorShoppingBag,
  ShoppingCart as PhosphorShoppingCart,
  SignIn as PhosphorSignIn,
  SignOut as PhosphorSignOut,
  SlidersHorizontal as PhosphorSlidersHorizontal,
  Sparkle as PhosphorSparkle,
  SpinnerGap as PhosphorSpinnerGap,
  StackSimple as PhosphorStackSimple,
  Star as PhosphorStar,
  SquaresFour as PhosphorSquaresFour,
  Storefront as PhosphorStorefront,
  Sun as PhosphorSun,
  Tag as PhosphorTag,
  Trash as PhosphorTrash,
  TrendUp as PhosphorTrendUp,
  Upload as PhosphorUpload,
  User as PhosphorUser,
  UserCircle as PhosphorUserCircle,
  UsersThree as PhosphorUsersThree,
  Warning as PhosphorWarning,
  WarningCircle as PhosphorWarningCircle,
  X as PhosphorX,
  XCircle as PhosphorXCircle,
  YoutubeLogo as PhosphorYoutubeLogo,
} from "@phosphor-icons/react/ssr";
import type {
  Icon as PhosphorIcon,
  IconProps,
  IconWeight,
} from "@phosphor-icons/react/dist/lib/types";

export type AppIcon = PhosphorIcon;
export type AppIconProps = IconProps;
export { type IconProps, type IconWeight };

const DEFAULT_ICON_WEIGHT: IconWeight = "light";

function withLightWeight(IconComponent: PhosphorIcon, displayName: string): PhosphorIcon {
  const WrappedIcon = forwardRef<SVGSVGElement, IconProps>(function WrappedIcon(
    { weight = DEFAULT_ICON_WEIGHT, ...props },
    ref,
  ) {
    return <IconComponent ref={ref} weight={weight} {...props} />;
  });

  WrappedIcon.displayName = displayName;
  return WrappedIcon;
}

export const AlertCircle = withLightWeight(PhosphorWarningCircle, "AlertCircle");
export const AlertTriangle = withLightWeight(PhosphorWarning, "AlertTriangle");
export const Activity = withLightWeight(PhosphorPulse, "Activity");
export const ArrowDown = withLightWeight(PhosphorArrowDown, "ArrowDown");
export const ArrowDownToLine = withLightWeight(PhosphorBoxArrowDown, "ArrowDownToLine");
export const Archive = withLightWeight(PhosphorArchive, "Archive");
export const ArrowLeft = withLightWeight(PhosphorArrowLeft, "ArrowLeft");
export const ArrowRight = withLightWeight(PhosphorArrowRight, "ArrowRight");
export const BarChart = withLightWeight(PhosphorChartBar, "BarChart");
export const BarChart2 = withLightWeight(PhosphorChartBar, "BarChart2");
export const BarChart3 = withLightWeight(PhosphorChartBar, "BarChart3");
export const BadgeCheck = withLightWeight(PhosphorSealCheck, "BadgeCheck");
export const Bell = withLightWeight(PhosphorBell, "Bell");
export const BookOpen = withLightWeight(PhosphorBookOpen, "BookOpen");
export const Camera = withLightWeight(PhosphorCamera, "Camera");
export const Check = withLightWeight(PhosphorCheck, "Check");
export const CheckCircle = withLightWeight(PhosphorCheckCircle, "CheckCircle");
export const CheckCircle2 = withLightWeight(PhosphorCheckCircle, "CheckCircle2");
export const CheckIcon = Check;
export const ChevronDown = withLightWeight(PhosphorCaretDown, "ChevronDown");
export const ChevronLeft = withLightWeight(PhosphorCaretLeft, "ChevronLeft");
export const ChevronRight = withLightWeight(PhosphorCaretRight, "ChevronRight");
export const ChevronRightIcon = ChevronRight;
export const ChevronUp = withLightWeight(PhosphorCaretUp, "ChevronUp");
export const Circle = withLightWeight(PhosphorCircle, "Circle");
export const CircleDollarSign = withLightWeight(
  PhosphorCurrencyCircleDollar,
  "CircleDollarSign",
);
export const CircleIcon = Circle;
export const CircleUser = withLightWeight(PhosphorUserCircle, "CircleUser");
export const Clock = withLightWeight(PhosphorClock, "Clock");
export const Clock3 = withLightWeight(PhosphorClock, "Clock3");
export const Compass = withLightWeight(PhosphorCompass, "Compass");
export const Copy = withLightWeight(PhosphorCopy, "Copy");
export const CreditCard = withLightWeight(PhosphorCreditCard, "CreditCard");
export const DollarSign = withLightWeight(PhosphorCurrencyDollar, "DollarSign");
export const Download = withLightWeight(PhosphorDownload, "Download");
export const ExternalLink = withLightWeight(PhosphorArrowSquareOut, "ExternalLink");
export const Eye = withLightWeight(PhosphorEye, "Eye");
export const FileEdit = withLightWeight(PhosphorNotePencil, "FileEdit");
export const FileJson = withLightWeight(PhosphorFileCode, "FileJson");
export const FilePlus = withLightWeight(PhosphorFilePlus, "FilePlus");
export const FileText = withLightWeight(PhosphorFileText, "FileText");
export const Filter = withLightWeight(PhosphorFunnel, "Filter");
export const FlaskConical = withLightWeight(PhosphorFlask, "FlaskConical");
export const Folder = withLightWeight(PhosphorFolder, "Folder");
export const Gift = withLightWeight(PhosphorGift, "Gift");
export const Globe = withLightWeight(PhosphorGlobeHemisphereWest, "Globe");
export const Grid2X2 = withLightWeight(PhosphorSquaresFour, "Grid2X2");
export const GripVertical = withLightWeight(PhosphorDotsSixVertical, "GripVertical");
export const Hash = withLightWeight(PhosphorHash, "Hash");
export const HelpCircle = withLightWeight(PhosphorQuestion, "HelpCircle");
export const Home = withLightWeight(PhosphorHouse, "Home");
export const ImageIcon = withLightWeight(PhosphorImageSquare, "ImageIcon");
export const ImagePlus = withLightWeight(PhosphorImageSquare, "ImagePlus");
export const Info = withLightWeight(PhosphorInfo, "Info");
export const Instagram = withLightWeight(PhosphorInstagramLogo, "Instagram");
export const KeyRound = withLightWeight(PhosphorKey, "KeyRound");
export const Layers = withLightWeight(PhosphorStackSimple, "Layers");
export const LayoutDashboard = withLightWeight(PhosphorGauge, "LayoutDashboard");
export const Library = withLightWeight(PhosphorBooks, "Library");
export const LifeBuoy = withLightWeight(PhosphorLifebuoy, "LifeBuoy");
export const Lightbulb = withLightWeight(PhosphorLightbulb, "Lightbulb");
export const Link = withLightWeight(PhosphorLink, "Link");
export const Link2 = withLightWeight(PhosphorLinkSimple, "Link2");
export const Linkedin = withLightWeight(PhosphorLinkedinLogo, "Linkedin");
export const ListChecks = withLightWeight(PhosphorListChecks, "ListChecks");
export const Loader2 = withLightWeight(PhosphorSpinnerGap, "Loader2");
export const Lock = withLightWeight(PhosphorLock, "Lock");
export const LogIn = withLightWeight(PhosphorSignIn, "LogIn");
export const LogOut = withLightWeight(PhosphorSignOut, "LogOut");
export const Mail = withLightWeight(PhosphorEnvelopeSimple, "Mail");
export const Menu = withLightWeight(PhosphorList, "Menu");
export const Monitor = withLightWeight(PhosphorMonitor, "Monitor");
export const Moon = withLightWeight(PhosphorMoon, "Moon");
export const Minus = withLightWeight(PhosphorMinus, "Minus");
export const MoreHorizontal = withLightWeight(PhosphorDotsThree, "MoreHorizontal");
export const MousePointerClick = withLightWeight(PhosphorCursorClick, "MousePointerClick");
export const Package = withLightWeight(PhosphorPackage, "Package");
export const PackagePlus = withLightWeight(PhosphorPackage, "PackagePlus");
export const PartyPopper = withLightWeight(PhosphorConfetti, "PartyPopper");
export const Pencil = withLightWeight(PhosphorPencilSimple, "Pencil");
export const PenSquare = withLightWeight(PhosphorNotePencil, "PenSquare");
export const Plus = withLightWeight(PhosphorPlus, "Plus");
export const QrCode = withLightWeight(PhosphorQrCode, "QrCode");
export const Rocket = withLightWeight(PhosphorRocketLaunch, "Rocket");
export const ReceiptText = withLightWeight(PhosphorReceipt, "ReceiptText");
export const RotateCcw = withLightWeight(PhosphorArrowCounterClockwise, "RotateCcw");
export const Save = withLightWeight(PhosphorFloppyDisk, "Save");
export const Search = withLightWeight(PhosphorMagnifyingGlass, "Search");
export const Settings = withLightWeight(PhosphorGear, "Settings");
export const ShieldCheck = withLightWeight(PhosphorShieldCheck, "ShieldCheck");
export const ShoppingBag = withLightWeight(PhosphorShoppingBag, "ShoppingBag");
export const ShoppingCart = withLightWeight(PhosphorShoppingCart, "ShoppingCart");
export const SlidersHorizontal = withLightWeight(
  PhosphorSlidersHorizontal,
  "SlidersHorizontal",
);
export const Sparkles = withLightWeight(PhosphorSparkle, "Sparkles");
export const Star = withLightWeight(PhosphorStar, "Star");
export const Store = withLightWeight(PhosphorStorefront, "Store");
export const Sun = withLightWeight(PhosphorSun, "Sun");
export const Tag = withLightWeight(PhosphorTag, "Tag");
export const Tags = withLightWeight(PhosphorTag, "Tags");
export const Trash2 = withLightWeight(PhosphorTrash, "Trash2");
export const TrendingUp = withLightWeight(PhosphorTrendUp, "TrendingUp");
export const Upload = withLightWeight(PhosphorUpload, "Upload");
export const UploadCloud = withLightWeight(PhosphorCloudArrowUp, "UploadCloud");
export const User = withLightWeight(PhosphorUser, "User");
export const Users = withLightWeight(PhosphorUsersThree, "Users");
export const X = withLightWeight(PhosphorX, "X");
export const XCircle = withLightWeight(PhosphorXCircle, "XCircle");
export const Youtube = withLightWeight(PhosphorYoutubeLogo, "Youtube");
export const ZoomIn = withLightWeight(PhosphorMagnifyingGlassPlus, "ZoomIn");
