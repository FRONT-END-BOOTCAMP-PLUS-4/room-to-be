import gsap from 'gsap';
import { Object3D } from 'three';

let floatingTimeline: gsap.core.Tween | null = null;

export function startFloating(object: Object3D) {
  stopFloating();
  floatingTimeline = gsap.to(object.position, {
    y: '+=0.1',
    duration: 1,
    repeat: -2,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

export function stopFloating() {
  if (floatingTimeline) {
    floatingTimeline.kill();
    floatingTimeline = null;
  }
}
