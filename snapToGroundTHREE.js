import * as THREE from './modules/three.module.js';

/**
 * This function move object to bottom using bounding box
 *
 * @param {THREE.Object3D} inObject Object which we want to snap to ground.
 * @param {Array:Object3D} inFloorMesh Array of object of floors or any other object where we want our inObject to snap
 * @return {Function} inCallBackFunc Optional callback function.
 */
export function snapObjectToBottom(inObject,inFloorMesh,inCallBackFunc) {
    
    if (!inObject) return 0

    // Getting bounding box from scene object
    let box = new THREE.Box3()
    box.setFromObject(inObject)
    console.log(box)

    // Getting bounding box center
    let center = new THREE.Vector3()
    box.getCenter(center)

    console.log(center)

    let castPoint = center.clone()
    castPoint.y = box.min.y

    // Cast ray from center in negative Y direction to check intersection
    const raycaster = new THREE.Raycaster(castPoint, new THREE.Vector3(0, -1, 0));
    let objectArr = [...inFloorMesh]
    let objectIndex = objectArr.indexOf(inObject)

    if (objectIndex != -1) {
        objectArr.splice(objectIndex, 1)
    }
    var intersectObjects = raycaster.intersectObjects(objectArr, true);
    if (!intersectObjects.length) return

    let snapPointY = intersectObjects[0].point.y

    console.log(snapPointY)

    let centerToBottomY = box.min.y - snapPointY
    console.log(centerToBottomY)


    inObject.position.y -= intersectObjects[0].distance

    if (inCallBackFunc) {
        inCallBackFunc()
    }

}