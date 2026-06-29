import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export const PhotoViewer = ({ children, ...props }) => {
    const imageElements = Array.isArray(children) ? children : [children];

    return (
        <PhotoProvider
            maskOpacity={0.8}
            toolbarRender={({ onRotate, onScale, scale, rotate, onToggleFullScreen }) => (
                <div className="d-flex gap-2 align-items-center px-3 py-2">
                    <button className="btn btn-icon btn-sm btn-light" onClick={() => onScale(scale + 1)} title="Zoom In">
                        <i className="ri-zoom-in-line"></i>
                    </button>
                    <button className="btn btn-icon btn-sm btn-light" onClick={() => onScale(scale - 1)} title="Zoom Out">
                        <i className="ri-zoom-out-line"></i>
                    </button>
                    <button className="btn btn-icon btn-sm btn-light" onClick={() => onRotate(rotate + 90)} title="Rotate">
                        <i className="ri-refresh-line"></i>
                    </button>
                    <button className="btn btn-icon btn-sm btn-light" onClick={onToggleFullScreen} title="Fullscreen">
                        <i className="ri-fullscreen-line"></i>
                    </button>
                </div>
            )}
        >
            {imageElements.map((img, index) => (
                <PhotoView key={index} src={props.src || img.props.fullSrc || img.props.src}>
                    {img}
                </PhotoView>
            ))}
        </PhotoProvider>
    );
};
