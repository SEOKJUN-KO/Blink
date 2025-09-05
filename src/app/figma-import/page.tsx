
import React from 'react';
import { SVGIcon } from '../components/SVGIcon';
import { PlayButton } from '../components/PlayButton';

// --- Generic Components for Storybook-like page ---
type ComponentShowcaseProps = {
  name: string;
  children: React.ReactNode;
};

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ name, children }) => (
  <div className="border border-gray-300 rounded-lg p-4 my-4">
    <h2 className="text-lg font-semibold mb-2">{name}</h2>
    <div className="flex flex-wrap gap-4 items-center">{children}</div>
  </div>
);


type PlayPauseButtonProps = { type: 'Play' | 'Pause' };
const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ type }) => (
    <div style={{ width: '56px', height: '56px' }} className="border rounded-md flex items-center justify-center">
        <SVGIcon name={type} size={24} />
    </div>
);

type CountButtonProps = { status: 'On' | 'Off', type: 'Plus' | 'Minus' };
const CountButton: React.FC<CountButtonProps> = ({ status, type }) => (
    <div 
        style={{
            width: '20px',
            height: '20px',
            backgroundColor: status === 'On' ? '#5b5b5f' : '#cacad3'
        }}
        className="rounded-full flex items-center justify-center text-white"
    >
        {type === 'Plus' ? '+' : '-'}
    </div>
);

// --- Form Components ---
type CheckboxProps = { status: 'On' | 'Off', label: string };
const Checkbox: React.FC<CheckboxProps> = ({ status, label }) => (
    <div className="flex items-center gap-2">
        <div style={{width: '22px', height: '22px'}} className={`border ${status === 'On' ? 'bg-green-500' : 'bg-white'}`} />
        <span style={{fontFamily: 'Pretendard', fontSize: '16px', fontWeight: 500, color: 'rgba(0,0,0,0.9)'}}>{label}</span>
    </div>
);

type ToggleProps = { status: 'On' | 'Off' };
const Toggle: React.FC<ToggleProps> = ({ status }) => (
    <div style={{width: '44px', height: '24px', borderRadius: '20px', backgroundColor: status === 'On' ? '#51aa55' : '#e9e9ef'}} className="relative p-0.5">
        <div style={{width: status === 'On' ? '18px' : '12px', height: status === 'On' ? '18px' : '12px' }} className={`bg-white rounded-full transition-transform transform ${status === 'On' ? 'translate-x-5' : 'translate-x-1'}`} />
    </div>
);

// --- PiP Components ---
const PipBackdrop: React.FC = () => <div style={{width: '260px', height: '160px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px'}} />;
const PipHeader: React.FC = () => (
    <div style={{width: '260px', height: '28px', backgroundColor: '#fafafc'}} className="flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
            <SVGIcon name="Setting-PiP" size={16} />
            <span style={{fontFamily: 'Pretendard', fontSize: '11px', fontWeight: 500, color: 'rgba(0,0,0,0.7)'}}>seokjun-ko.github.io</span>
        </div>
        <div className="flex items-center gap-1">
            <SVGIcon name="Camera" size={16} />
            <SVGIcon name="CloseSmall" size={16} />
        </div>
    </div>
);

// --- Other Components ---
const ActivityIndicator: React.FC = () => (
    <div className="flex items-center gap-2">
        <div style={{width: '8px', height: '8px', backgroundColor: '#c5cdf2'}} className="rounded-full" />
        <div style={{width: '8px', height: '8px', backgroundColor: '#818fd5'}} className="rounded-full" />
        <div style={{width: '8px', height: '8px', backgroundColor: '#4455aa'}} className="rounded-full" />
    </div>
);
const ToastMessage: React.FC<{text: string}> = ({text}) => (
    <div style={{width: '280px', height: '48px', backgroundColor: '#5b5b5f', borderRadius: '6px'}} className="flex items-center px-4">
        <span style={{fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 500, color: '#ffffff'}}>{text}</span>
    </div>
);
type VisualAlertProps = { status: 'On' | 'Off' };
const VisualAlert: React.FC<VisualAlertProps> = ({ status }) => (
    <div style={{width: '64px', height: '64px'}} className={`rounded-full bg-white flex items-center justify-center`}>
        <div style={{width: '52.57px', height: '52.57px'}} className={`rounded-full border-2 ${status === 'On' ? 'border-[#74c577]' : 'border-[#e9e9ef]'}`} />
    </div>
);


// --- Main Page to display all components ---
const ComponentsPage = () => (
  <div className="p-8 bg-gray-50">
    <h1 className="text-2xl font-bold mb-4">Component Library (High-Fidelity)</h1>

    <ComponentShowcase name="Icons">
      <SVGIcon name="Play" size={16} />
      <SVGIcon name="Stop" size={16} />
      <SVGIcon name="Report" size={24} />
      <SVGIcon name="CloseSmall" size={16} />
      <SVGIcon name="CloseBig" size={28} />
      <SVGIcon name="Info" size={20} />
      <SVGIcon name="Camera" size={16} />
      <SVGIcon name="Setting-PiP" size={16} />
      <SVGIcon name="Setting" size={24} />
    </ComponentShowcase>

    <ComponentShowcase name="Buttons">
      <PlayButton status="Default" label="라벨" />
      <PlayButton status="Hover" label="라벨" />
      <PlayButton status="Disabled" label="라벨" />
    </ComponentShowcase>
    
    <ComponentShowcase name="Play/Pause Buttons">
        <PlayPauseButton type="Play" />
        <PlayPauseButton type="Pause" />
    </ComponentShowcase>

    <ComponentShowcase name="Count Buttons">
        <CountButton status="On" type="Plus" />
        <CountButton status="On" type="Minus" />
        <CountButton status="Off" type="Plus" />
        <CountButton status="Off" type="Minus" />
    </ComponentShowcase>

    <ComponentShowcase name="Forms">
      <Checkbox status="On" label="라벨" />
      <Checkbox status="Off" label="라벨" />
      <Toggle status="On" />
      <Toggle status="Off" />
    </ComponentShowcase>

    <ComponentShowcase name="PiP (Picture-in-Picture)">
      <PipBackdrop />
      <PipHeader />
    </ComponentShowcase>

    <ComponentShowcase name="Indicators">
      <ActivityIndicator />
      <VisualAlert status="On" />
      <VisualAlert status="Off" />
    </ComponentShowcase>

    <ComponentShowcase name="Overlays">
      <ToastMessage text="텍스트" />
    </ComponentShowcase>

  </div>
);

export default ComponentsPage;
