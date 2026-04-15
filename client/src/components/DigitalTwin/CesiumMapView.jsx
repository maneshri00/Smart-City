import React, { useEffect, useState, useRef } from 'react';
import { Viewer, Scene, CameraFlyTo, Entity, PointGraphics, PathGraphics } from 'resium';
import { Cartesian3, Color, createOsmBuildingsAsync, ColorMaterialProperty, JulianDate, VelocityOrientationProperty, SampledPositionProperty, ExtrapolationType } from 'cesium';

// Note: To see buildings properly without limitations, you typically need an Ion Access Token!
// import { Ion } from 'cesium';
// Ion.defaultAccessToken = 'YOUR_ION_TOKEN_HERE'; 

export default function CesiumMapView() {
  const viewerRef = useRef(null);
  const [vehicles, setVehicles] = useState([]);
  const [buildingsLoaded, setBuildingsLoaded] = useState(false);

  useEffect(() => {
    // Generate some mock traffic paths around NYC
    const newVehicles = [];
    const baseLon = -74.006;
    const baseLat = 40.7100;
    
    // Create 30 vehicles
    for (let i = 0; i < 30; i++) {
        const startLon = baseLon + (Math.random() - 0.5) * 0.05;
        const startLat = baseLat + (Math.random() - 0.5) * 0.05;
        
        // Use a position property that samples time to generate movement
        const positionProperty = new SampledPositionProperty();
        positionProperty.forwardExtrapolationType = ExtrapolationType.NONE;

        const start = JulianDate.now();
        
        let currentLon = startLon;
        let currentLat = startLat;

        // Add 50 waypoints to make the car drive around
        for (let w = 0; w < 50; w++) {
           const time = JulianDate.addSeconds(start, w * 10, new JulianDate());
           const position = Cartesian3.fromDegrees(currentLon, currentLat, 0); // Ground level
           positionProperty.addSample(time, position);
           
           // move randomly block by block to simulate streets roughly
           if (Math.random() > 0.5) {
               currentLon += (Math.random() - 0.5) * 0.002;
           } else {
               currentLat += (Math.random() - 0.5) * 0.002;
           }
        }

        newVehicles.push({
            id: `vehicle-${i}`,
            position: positionProperty,
            orientation: new VelocityOrientationProperty(positionProperty), // Faces the direction of travel
            isCongested: Math.random() < 0.2 // 20% are in heavy traffic (red)
        });
    }

    setVehicles(newVehicles);
  }, []);

  // Hook to load OSM BUILDINGS into the viewer once mounted natively
  useEffect(() => {
      if (viewerRef.current && viewerRef.current.cesiumElement && !buildingsLoaded) {
        const viewer = viewerRef.current.cesiumElement;
        const loadBuildings = async () => {
            try {
                const buildingsTileset = await createOsmBuildingsAsync();
                viewer.scene.primitives.add(buildingsTileset);
                setBuildingsLoaded(true);
            } catch (error) {
                console.log("Cesium OSM Buildings load failed, possibly due to lack of Ion token.");
            }
        };
        loadBuildings();
      }
  }, [viewerRef.current, buildingsLoaded]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl bg-slate-900 border border-slate-700">
        <Viewer 
            ref={viewerRef}
            full 
            timeline={true} 
            animation={true} 
            baseLayerPicker={false}
            homeButton={false}
            geocoder={false}
            navigationHelpButton={false}
            sceneModePicker={false}
            shouldAnimate={true}
            infoBox={true} // Allow clicking on entities to see info
            selectionIndicator={true}
        >   
            <Scene requestRenderMode={false} highDynamicRange={true} />
            
            {/* Starts camera aimed at NYC Downtown (slightly angled down) */}
            <CameraFlyTo 
                destination={Cartesian3.fromDegrees(-74.0060, 40.7050, 1000)} // Lon, Lat, Height
                orientation={{
                    heading: 0.0,
                    pitch: -0.8, // Look down at an angle
                    roll: 0.0
                }}
                duration={3} 
                once={true}
            />

            {/* Render the moving vehicles */}
            {vehicles.map(v => (
                <Entity 
                    key={v.id}
                    position={v.position}
                    orientation={v.orientation}
                    name="Live Vehicle"
                    description={`Tracking ID: ${v.id}<br/>Status: ${v.isCongested ? 'Heavy Traffic' : 'Moving Smoothly'}`}
                >
                    <PointGraphics 
                        pixelSize={12} 
                        color={v.isCongested ? Color.RED : Color.CYAN} 
                        outlineColor={Color.WHITE} 
                        outlineWidth={2} 
                    />
                    {/* A tail showing its path fading off behind it */}
                    <PathGraphics 
                        material={new ColorMaterialProperty(v.isCongested ? Color.RED.withAlpha(0.6) : Color.CYAN.withAlpha(0.6))}
                        width={4}
                        leadTime={0}
                        trailTime={15}
                    />
                </Entity>
            ))}
        </Viewer>

        {/* Floating Custom Overlay Notice */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-lg border border-slate-600 shadow-xl pointer-events-none z-10">
            <h3 className="font-bold text-teal-400">Cesium Live Traffic Twin</h3>
            <p className="text-xs text-slate-300">Simulating 30 active vehicle endpoints in lower Manhattan.</p>
            <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-700/50 pt-2">
               If 3D buildings do not load, supply your free <br/>
               <span className="font-semibold text-white">Cesium Ion Token</span> in the source file.
            </p>
        </div>
    </div>
  );
}
