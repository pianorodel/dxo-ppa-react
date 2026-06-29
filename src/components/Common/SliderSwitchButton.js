import React, { useLayoutEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Input, Label } from "reactstrap";

const THUMB_MARGIN = 3;
const LABEL_PAD = 14;

const SliderSwitchButton = ({
  name,
  control,
  label,
  defaultValue = false,
  onLabel = "On",
  offLabel = "Off",
  onValue = true,
  offValue = false,
  onColor = "success",
  offColor = "secondary",
  disabled = false,
  size = "sm",
  ...props
}) => {
  const onRef = useRef(null);
  const offRef = useRef(null);

  const sizes = {
    sm: { height: 20, thumb: 14, font: 9 },
    md: { height: 24, thumb: 18, font: 10 },
    lg: { height: 28, thumb: 22, font: 11 },
  };

  const current = sizes[size] ?? sizes.sm;

  const [trackWidth, setTrackWidth] = useState(80);
  const [labelAreaWidth, setLabelAreaWidth] = useState(40);

  useLayoutEffect(() => {
    const onWidth = onRef.current?.offsetWidth ?? 0;
    const offWidth = offRef.current?.offsetWidth ?? 0;
    const maxLabel = Math.max(onWidth, offWidth);

    const lw = maxLabel + LABEL_PAD;
    const total = THUMB_MARGIN + current.thumb + THUMB_MARGIN + lw;

    setLabelAreaWidth(lw);
    setTrackWidth(total);
  }, [onLabel, offLabel, size, current.thumb]);

  return (
    <div className="mb-3">
      <style>{`
        .vz-switch {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        .vz-track {
          position: relative;
          border-radius: 999px;
          transition: background .25s ease;
          font-weight: 600;
          box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
        }
        .vz-label {
          position: absolute;
          white-space: nowrap;
          pointer-events: none;
          z-index: 2;
          font-size: inherit;
          line-height: 1;
          top: 50%;
          transform: translateY(-50%);
          text-align: center;
        }
        .vz-thumb {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          transition: left .25s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 2px 6px rgba(0,0,0,.2);
          z-index: 3;
          top: 50%;
          transform: translateY(-50%);
        }
        .vz-success   { background: #0ab39c; color: #fff; }
        .vz-danger    { background: #f06548; color: #fff; }
        .vz-primary   { background: #405189; color: #fff; }
        .vz-secondary { background: #878a99; color: #fff; }
        .vz-warning   { background: #f7b84b; color: #212529; }
        .vz-info      { background: #299cdb; color: #fff; }
        .vz-disabled  { opacity: .6; pointer-events: none; }
        .vz-measure-ghost {
          position: fixed;
          top: -9999px;
          left: -9999px;
          visibility: hidden;
          pointer-events: none;
          white-space: nowrap;
          font-weight: 600;
        }
      `}</style>

      <span ref={onRef} className="vz-measure-ghost" style={{ fontSize: current.font }}>
        {onLabel}
      </span>
      <span ref={offRef} className="vz-measure-ghost" style={{ fontSize: current.font }}>
        {offLabel}
      </span>

      {label && (
        <Label for={name} className="form-label">
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
          const checked = field.value === onValue;

          const thumbZone = THUMB_MARGIN + current.thumb + THUMB_MARGIN;
          const thumbLeft = checked ? trackWidth - current.thumb - THUMB_MARGIN : THUMB_MARGIN;
          const labelLeft = checked ? THUMB_MARGIN : thumbZone;

          const toggle = () => {
            if (!disabled) field.onChange(checked ? offValue : onValue);
          };

          return (
            <div>
              <Input {...field} {...props} type="checkbox" checked={checked} className="d-none" disabled={disabled} onChange={toggle} />

              <div
                className={`vz-switch${disabled ? " vz-disabled" : ""}`}
                onClick={toggle}
                role="switch"
                aria-checked={checked}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggle();
                  }
                }}>
                <div
                  className={`vz-track vz-${checked ? onColor : offColor}`}
                  style={{ width: trackWidth, height: current.height, fontSize: current.font }}>
                  <span className="vz-label" style={{ left: labelLeft, width: labelAreaWidth }}>
                    {checked ? onLabel : offLabel}
                  </span>

                  <div className="vz-thumb" style={{ width: current.thumb, height: current.thumb, left: thumbLeft }} />
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default SliderSwitchButton;
