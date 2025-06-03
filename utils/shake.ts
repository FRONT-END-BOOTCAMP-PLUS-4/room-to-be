import gsap from 'gsap';
import { Object3D } from 'three';

let shakeTimeline: gsap.core.Timeline | null = null;

export function startShakeAnimation(object: Object3D) {
  stopShakeAnimation();

  const originalScale = object.scale.clone();

  shakeTimeline = gsap.timeline({ repeat: -1, yoyo: true });

  shakeTimeline
    .to(object.scale, {
      x: originalScale.x * 1.05,
      y: originalScale.y * 1.05,
      z: originalScale.z * 1.05,
      duration: 0.05,
      ease: 'power1.inOut',
    })
    .to(object.scale, {
      x: originalScale.x,
      y: originalScale.y,
      z: originalScale.z,
      duration: 0.05,
      ease: 'power1.inOut',
    });
}

export function stopShakeAnimation() {
  if (shakeTimeline) {
    shakeTimeline.kill();
    shakeTimeline = null;
  }
}
