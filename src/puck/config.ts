import { Config } from "@puckjs/core";

// Atoms
import { ButtonPuck } from "../blocks/atoms/Button/Button.puck";
import { IconPuck } from "../blocks/atoms/Icon/Icon.puck";
import { BadgePuck } from "../blocks/atoms/Badge/Badge.puck";
import { TooltipPuck } from "../blocks/atoms/Tooltip/Tooltip.puck"; // Fixed from Button.puck to Tooltip.puck

// Molecules
import { TabItemPuck } from "../blocks/molecules/TabItem/TabItem.puck";
import { PanelHeaderPuck } from "../blocks/molecules/PanelHeader/PanelHeader.puck";
import { ClipCardPuck } from "../blocks/molecules/ClipCard/ClipCard.puck";
import { TrackHeaderPuck } from "../blocks/molecules/TrackHeader/TrackHeader.puck";

// Organisms
import { IconBarPuck } from "../blocks/organisms/IconBar/IconBar.puck";
import { LeftPanelPuck } from "../blocks/organisms/LeftPanel/LeftPanel.puck";
import { PreviewAreaPuck } from "../blocks/organisms/PreviewArea/PreviewArea.puck";
import { RightPanelPuck } from "../blocks/organisms/RightPanel/RightPanel.puck";
import { QuickToolbarPuck } from "../blocks/organisms/QuickToolbar/QuickToolbar.puck";
import { TimelinePuck } from "../blocks/organisms/Timeline/Timeline.puck";
import { TopBarPuck } from "../blocks/organisms/TopBar/TopBar.puck";
import { StatusBarPuck } from "../blocks/organisms/StatusBar/StatusBar.puck";
import { CommandPalettePuck } from "../blocks/organisms/CommandPalette/CommandPalette.puck";

// Templates
import { HomeDashboardPuck } from "../blocks/templates/HomeDashboard/HomeDashboard.puck";
import { AICreatorShellPuck } from "../blocks/templates/AICreatorShell/AICreatorShell.puck";
import { EditorShellPuck } from "../blocks/templates/EditorShell/EditorShell.puck";
import { ExportShellPuck } from "../blocks/templates/ExportShell/ExportShell.puck";

export type RootProps = {
  title: string;
};

export const config: Config<RootProps> = {
  components: {
    // Atoms
    Button: ButtonPuck,
    Icon: IconPuck,
    Badge: BadgePuck,
    Tooltip: TooltipPuck,

    // Molecules
    TabItem: TabItemPuck,
    PanelHeader: PanelHeaderPuck,
    ClipCard: ClipCardPuck,
    TrackHeader: TrackHeaderPuck,

    // Organisms
    IconBar: IconBarPuck,
    LeftPanel: LeftPanelPuck,
    PreviewArea: PreviewAreaPuck,
    RightPanel: RightPanelPuck,
    QuickToolbar: QuickToolbarPuck,
    Timeline: TimelinePuck,
    TopBar: TopBarPuck,
    StatusBar: StatusBarPuck,
    CommandPalette: CommandPalettePuck,

    // Templates
    HomeDashboard: HomeDashboardPuck,
    AICreatorShell: AICreatorShellPuck,
    EditorShell: EditorShellPuck,
    ExportShell: ExportShellPuck,
  },
};
