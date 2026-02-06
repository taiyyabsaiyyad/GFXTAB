import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactForm from './ContactForm';

gsap.registerPlugin(ScrollTrigger);

const GfxtabPortfolio = () => {
  const canvasRef = useRef(null);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 5, 40);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const neonLight = new THREE.PointLight(0x00f6ff, 2, 20);
    neonLight.position.set(0, 0, 10);
    scene.add(neonLight);

    // BACKGROUND PARTICLES
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starPos.length; i++) {
      starPos[i] = (Math.random() - 0.5) * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0x00f6ff,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // PROJECT PANELS DATA
    const projects = [
      { title: 'Logo Design', category: 'Branding' },
      { title: 'Digital Invite', category: 'Design' },
      { title: 'Social Media Post', category: 'Content' },
      { title: 'Motion Reels', category: 'Animation' },
      { title: 'VFX Edits', category: 'Visual Effects' },
    ];

    const panelGroup = new THREE.Group();
    scene.add(panelGroup);

    const panelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      roughness: 0.2,
      transmission: 0.6,
      thickness: 1,
      clearcoat: 1,
      emissive: new THREE.Color(0x00f6ff),
      emissiveIntensity: 0.15
    });

    const panels = [];
    for (let i = 0; i < projects.length; i++) {
      const panelGeo = new THREE.PlaneGeometry(4, 2.2);
      const panel = new THREE.Mesh(panelGeo, panelMaterial);
      panel.position.set(
        (i % 2 === 0 ? -1 : 1) * 3,
        -i * 2,
        -i * 4
      );
      panel.rotation.y = i % 2 === 0 ? 0.2 : -0.2;
      panel.userData = { index: i, project: projects[i] };
      panelGroup.add(panel);
      panels.push(panel);
    }

    // CAMERA SCROLL
    gsap.to(camera.position, {
      z: -25,
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    // HERO FADE
    gsap.to('#heroText', {
      opacity: 0,
      scrollTrigger: {
        start: 'top top',
        end: '30% top',
        scrub: true
      }
    });

    // ANIMATION LOOP
    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0006;
      panelGroup.rotation.y += 0.0005;
      
      // Subtle panel animation
      panels.forEach((panel, i) => {
        panel.rotation.x = Math.sin(Date.now() * 0.0005 + i) * 0.05;
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // RESIZE
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />
      
      <div className="ui-overlay">
        <div className="hero-text" id="heroText" data-testid="hero-text">
          GFXTAB
        </div>
        
        <div className="section-label work-label" data-testid="work-label">
          SELECTED WORK
        </div>
        
        <div className="section-label about-label" data-testid="about-label">
          ABOUT
        </div>
        
        <div className="section-label contact-label" data-testid="contact-label">
          CONTACT
        </div>

        {/* Work Section */}
        <div className="work-section" data-testid="work-section">
          <div className="work-grid">
            {[
              { title: 'Logo Design', category: 'Branding', desc: 'Premium brand identity systems' },
              { title: 'Digital Invite', category: 'Design', desc: 'Elegant event invitations' },
              { title: 'Social Media Post', category: 'Content', desc: 'Engaging social visuals' },
              { title: 'Motion Reels', category: 'Animation', desc: 'Dynamic motion graphics' },
              { title: 'VFX Edits', category: 'Visual Effects', desc: 'Professional video effects' },
              { title: 'Manipulation Visuals', category: 'Art', desc: 'Creative photo manipulation' }
            ].map((project, index) => (
              <div 
                key={index} 
                className="project-card" 
                data-testid={`project-card-${index}`}
              >
                <div className="project-number">0{index + 1}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
                <p className="project-desc">{project.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="about-section" data-testid="about-section">
          <div className="about-content">
            <h2 className="about-heading">Designers Choice | Assets & Reels</h2>
            <p className="about-text">
              Where visuals meet imagination, crafting premium assets and reels 
              that inspire, engage, and define brands.
            </p>
            <p className="about-subtext">
              GFXTAB specializes in creating cinematic visual experiences that 
              push creative boundaries. From motion design to VFX, every project 
              is crafted with precision and artistic vision.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section" data-testid="contact-section">
          <div className="contact-content">
            <h2 className="contact-heading">Let's Create Something</h2>
            <p className="contact-subtext">Ready to bring your vision to life?</p>
            <button 
              className="contact-button"
              data-testid="open-contact-form-btn"
              onClick={() => setShowContactForm(true)}
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="footer" data-testid="footer">
          <p>© 2025 GFXTAB - Crafted by Taiyyab Saiyyad</p>
        </div>
      </div>

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
};

export default GfxtabPortfolio;
