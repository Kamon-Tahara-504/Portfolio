import SkillsTimeline from "@/components/skills/SkillsTimeline";
import { Skills } from "@/types/profile";

// タイムラインパネル描画に必要な入力。
interface SkillsTimelinePanelProps {
  skills: Skills;
  contentVisible: boolean;
}

// タイムラインの出入りアニメーションを含む表示ラッパー。
export default function SkillsTimelinePanel({ skills, contentVisible }: SkillsTimelinePanelProps) {
  return <SkillsTimeline skills={skills} contentVisible={contentVisible} />;
}
