import classes from './Popup.module.css'
import { cameraPresetsSlice } from '../store/slices/cameras'
import { useDispatch, useSelector } from 'react-redux';

interface PresetProps {
  index: number;
}

const CameraPresetTag = ({ index }: PresetProps) => {
  const { setCurrentPreset } = cameraPresetsSlice.actions;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setCurrentPreset(index));
  }

  return (
    <div className={ classes.preset } onClick={ handleClick }>
      { index + 1 }
    </div>
  );
}

export const Popup = () => {
  const { getPresets } = cameraPresetsSlice.selectors;
  const presets = useSelector(getPresets);

  const renderPresets = () => {
    return presets.map((_, i) => <CameraPresetTag index={ i } />);
  }

  return (
    <div className={classes.popup}>
      { presets.length === 0 ? <b>There's no presets</b> : renderPresets() }
    </div>
  )
}
