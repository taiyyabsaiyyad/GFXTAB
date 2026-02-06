import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactForm from './ContactForm';

gsap.registerPlugin(ScrollTrigger);

const GfxtabPortfolio = () => {
  const canvasRef = useRef(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { title: 'Neon 3D Orb', category: '3D Design', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', folder: '#' },
    { title: 'City Manipulation', category: 'Photo Manipulation', image: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=800', folder: '#' },
    { title: 'Motion Graphics Reel', category: 'Motion Design', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800', folder: '#' },
    { title: 'Logo Design', category: 'Brand Identity', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800', folder: '#' },
    { title: 'Digital Invite', category: 'Design', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', folder: '#' },
    { title: 'VFX Compositing', category: 'Visual Effects', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800', folder: '#' }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 50, 200);

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x222244, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 2, 2000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();

    // EARTH (Realistic)
    const earthGeo = new THREE.SphereGeometry(30, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      shininess: 25,
      specular: 0x333333
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(-150, 0, -300);
    scene.add(earth);

    // MOON
    const moonGeo = new THREE.SphereGeometry(8, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      emissive: 0x222222
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-150, 0, -250);
    scene.add(moon);

    // MARS
    const marsGeo = new THREE.SphereGeometry(15, 48, 48);
    const marsMat = new THREE.MeshPhongMaterial({
      color: 0xff5533,
      emissive: 0x331100
    });
    const mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.set(200, -50, -500);
    scene.add(mars);

    // JUPITER (Big planet)
    const jupiterGeo = new THREE.SphereGeometry(50, 64, 64);
    const jupiterMat = new THREE.MeshPhongMaterial({
      color: 0xddaa88,
      emissive: 0x332211
    });
    const jupiter = new THREE.Mesh(jupiterGeo, jupiterMat);
    jupiter.position.set(-300, 100, -800);
    scene.add(jupiter);

    // SATURN with RINGS
    const saturnGeo = new THREE.SphereGeometry(40, 64, 64);
    const saturnMat = new THREE.MeshPhongMaterial({
      color: 0xffdd99,
      emissive: 0x332200
    });
    const saturn = new THREE.Mesh(saturnGeo, saturnMat);
    saturn.position.set(350, -80, -1200);
    scene.add(saturn);

    // Saturn rings
    const ringGeo = new THREE.RingGeometry(50, 80, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xccaa77,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    saturn.add(ring);

    // ASTEROID BELT
    const asteroids = [];
    for (let i = 0; i < 300; i++) {
      const size = Math.random() * 2 + 0.5;
      const asteroidGeo = new THREE.DodecahedronGeometry(size, 0);
      const asteroidMat = new THREE.MeshPhongMaterial({
        color: 0x666666,
        emissive: 0x111111
      });
      const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
      
      const angle = Math.random() * Math.PI * 2;
      const radius = 400 + Math.random() * 200;
      asteroid.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 100,
        Math.sin(angle) * radius - 600
      );
      
      asteroid.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      };
      
      asteroids.push(asteroid);
      scene.add(asteroid);
    }

    // DISTANT STARS
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4000;
      positions[i + 1] = (Math.random() - 0.5) * 4000;
      positions[i + 2] = (Math.random() - 0.5) * 4000;
    }
    
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // GALAXY DUST
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 1000;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    
    for (let i = 0; i < dustCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1000 + 200;
      dustPositions[i] = Math.cos(angle) * radius;
      dustPositions[i + 1] = (Math.random() - 0.5) * 200;
      dustPositions[i + 2] = Math.sin(angle) * radius - 800;
      
      dustColors[i] = 0.3 + Math.random() * 0.4;
      dustColors[i + 1] = 0.2 + Math.random() * 0.3;
      dustColors[i + 2] = 0.5 + Math.random() * 0.5;
    }
    
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    
    const dustMat = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // SCROLL CAMERA JOURNEY
    let targetZ = 200;
    let targetY = 50;

    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        targetZ = 200 - (progress * 1500);
        targetY = 50 + Math.sin(progress * Math.PI * 2) * 80;
        camera.lookAt(0, 0, targetZ - 500);
      }
    });

    // ANIMATION LOOP
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Smooth camera movement
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      
      // Rotate planets
      earth.rotation.y += 0.001;
      mars.rotation.y += 0.0008;
      jupiter.rotation.y += 0.0012;
      saturn.rotation.y += 0.0009;
      
      // Orbit moon around earth
      moon.position.x = earth.position.x + Math.cos(time * 0.5) * 50;
      moon.position.z = earth.position.z + Math.sin(time * 0.5) * 50;
      
      // Rotate asteroids
      asteroids.forEach(asteroid => {
        asteroid.rotation.x += asteroid.userData.rotationSpeed.x;
        asteroid.rotation.y += asteroid.userData.rotationSpeed.y;
        asteroid.rotation.z += asteroid.userData.rotationSpeed.z;
      });
      
      // Rotate stars slowly
      stars.rotation.y += 0.0001;
      
      // Rotate dust
      dust.rotation.y += 0.0002;
      
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

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="solar-portfolio">
      <canvas ref={canvasRef} className="solar-canvas" />
      
      <div className="solar-content">
        {/* HERO */}
        <section className="solar-hero" data-testid="hero-section">
          <div className="solar-hero-content">
            <div className="solar-brand" data-testid="brand-mark">GFXTAB</div>
            <h1 className="solar-title" data-testid="hero-headline">
              We Design Visual Experiences<br/>That Define Modern Brands
            </h1>
            <p className="solar-subtitle" data-testid="hero-subline">
              Journey through creativity. Where imagination meets execution in a cosmic dance of pixels, motion, and meaning.
            </p>
            <div className="solar-tagline" data-testid="hero-power-statement">
              Premium by design. Strategic by intention.
            </div>
            <div className="solar-buttons">
              <button 
                className="solar-btn-primary" 
                data-testid="start-project-btn-hero"
                onClick={() => setShowContactForm(true)}
              >
                Start a Project
              </button>
              <button 
                className="solar-btn-secondary" 
                data-testid="view-work-btn"
                onClick={() => document.getElementById('workSection').scrollIntoView({ behavior: 'smooth' })}
              >
                View Selected Work
              </button>
            </div>
          </div>
        </section>

        {/* PROOF */}
        <section className="solar-proof" data-testid="proof-strip">
          <div className="solar-proof-item">
            <div className="solar-proof-num">120+</div>
            <div className="solar-proof-label">Projects Delivered</div>
          </div>
          <div className="solar-divider"></div>
          <div className="solar-proof-item">
            <div className="solar-proof-num">4+</div>
            <div className="solar-proof-label">Years Expertise</div>
          </div>
          <div className="solar-divider"></div>
          <div className="solar-proof-item">
            <div className="solar-proof-num">Studio-Level</div>
            <div className="solar-proof-label">Execution</div>
          </div>
        </section>

        {/* WORK */}
        <section className="solar-work" id="workSection" data-testid="work-section">
          <div className="solar-section-header">
            <h2 className="solar-section-title" data-testid="work-title">Selected Work</h2>
            <p className="solar-section-sub">
              A refined selection of projects demonstrating strategic thinking, modern aesthetics, and meticulous execution.
            </p>
            <div className="solar-quote">Great brands are not accidental. They are designed.</div>
          </div>
          
          <div className="solar-work-grid">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="solar-project-card" 
                data-testid={`project-card-${index}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="solar-project-img">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="solar-project-overlay">
                    <span>View Project</span>
                  </div>
                </div>
                <div className="solar-project-info">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONING */}
        <section className="solar-positioning" data-testid="positioning-section">
          <h2 className="solar-section-title">Built for Brands That Intend to Lead</h2>
          <div className="solar-positioning-content">
            <p>We partner with ambitious businesses and emerging brands to craft visuals that influence perception and accelerate growth.</p>
            <p>Every detail is deliberate. Every design serves a purpose.</p>
            <p className="solar-closer">Not decoration. Direction.</p>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="solar-capabilities" data-testid="capabilities-section">
          <h2 className="solar-section-title">Capabilities</h2>
          <div className="solar-cap-grid">
            {[
              { title: 'Brand Identity', desc: 'Strategic visual systems designed for recognition and long-term brand equity.' },
              { title: 'Motion Design', desc: 'Cinematic visuals engineered to capture attention in fast-moving digital spaces.' },
              { title: 'Digital Creatives', desc: 'Modern, conversion-aware design tailored for today platforms.' },
              { title: 'Photo Manipulation', desc: 'High-detail compositions that transform concepts into powerful visuals.' }
            ].map((cap, i) => (
              <div key={i} className="solar-cap-item">
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER */}
        <section className="solar-founder" data-testid="founder-section">
          <div className="solar-founder-logo">
            <img 
              src="https://drive.google.com/uc?export=view&id=1sMjejBtmc5If2PABfdaWv35U3duIu57h" 
              alt="GFXTAB"
            />
          </div>
          <h2 className="solar-section-title">Founder-Led. Detail-Obsessed.</h2>
          <div className="solar-founder-content">
            <p>GFXTAB was founded by <strong>Taiyyab Saiyyad</strong>, a visual designer known for blending strategic clarity with striking aesthetics.</p>
            <p>With over four years of professional experience, his work reflects a commitment to precision, modern design language, and results-driven creativity.</p>
            <div className="solar-founder-quote">
              Good design attracts attention.<br/>
              Exceptional design earns trust.
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="solar-process" data-testid="process-section">
          <h2 className="solar-section-title">Process</h2>
          <div className="solar-process-grid">
            {[
              { num: '01', title: 'Discover', desc: 'Understanding your brand, audience, and objectives.' },
              { num: '02', title: 'Define', desc: 'Translating insights into clear creative direction.' },
              { num: '03', title: 'Design', desc: 'Crafting visuals with precision and intention.' },
              { num: '04', title: 'Refine', desc: 'Polishing every detail until it meets studio standards.' },
              { num: '05', title: 'Deliver', desc: 'Production-ready assets built for impact.' }
            ].map((step, i) => (
              <div key={i} className="solar-process-step">
                <div className="solar-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="solar-trust" data-testid="trust-section">
          <h2 className="solar-section-title">Building Long-Term Creative Partnerships</h2>
          <p className="solar-trust-text">
            Clients value GFXTAB for reliability, refined aesthetics, and a process that respects both timelines and quality.
          </p>
        </section>

        {/* PLATFORMS */}
        <section className="solar-platforms" data-testid="platforms-section">
          <h2 className="solar-section-title">Professional Platforms</h2>
          <div className="solar-platforms-grid">
            {[
              { 
                name: 'Behance', 
                desc: 'Portfolio & Case Studies', 
                url: 'https://www.behance.net/taiyyabsaiyyad1',
                testid: 'behance-link',
                icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>
              },
              { 
                name: 'Instagram', 
                desc: 'Creative Showcase', 
                url: 'https://www.instagram.com/gfxtab',
                testid: 'instagram-link',
                icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              },
              { 
                name: 'LinkedIn', 
                desc: 'Professional Journey', 
                url: 'https://www.linkedin.com/in/taiyyab-saiyyad-031887192',
                testid: 'linkedin-link',
                icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              }
            ].map((platform, i) => (
              <a 
                key={i}
                href={platform.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="solar-platform-card"
                data-testid={platform.testid}
              >
                <div className="solar-platform-icon">{platform.icon}</div>
                <h3>{platform.name}</h3>
                <p>{platform.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="solar-cta" data-testid="final-cta">
          <h2 className="solar-cta-title">Let's Create Something Remarkable</h2>
          <p className="solar-cta-text">
            Whether you are launching a brand, elevating your presence, or redefining your visual identity, the right design can transform perception.
          </p>
          <p className="solar-cta-sub">Start the conversation.</p>
          <button 
            className="solar-btn-primary-large" 
            data-testid="start-project-btn-cta"
            onClick={() => setShowContactForm(true)}
          >
            Start a Project
          </button>
          <p className="solar-cta-notice">Currently accepting select projects.</p>
        </section>

        {/* FOOTER */}
        <footer className="solar-footer" data-testid="footer">
          <p>© 2025 GFXTAB — Crafted by Taiyyab Saiyyad</p>
          <p className="solar-footer-tag">Where visuals meet the cosmos.</p>
        </footer>
      </div>

      {/* PROJECT MODAL with CREATIVE CLOSE */}
      {selectedProject && (
        <div className="solar-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="solar-modal" onClick={(e) => e.stopPropagation()}>
            <button className="solar-modal-close" onClick={() => setSelectedProject(null)}>
              <span className="close-line close-line-1"></span>
              <span className="close-line close-line-2"></span>
            </button>
            <div className="solar-modal-img">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="solar-modal-details">
              <div>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.category}</p>
              </div>
              <a href={selectedProject.folder} target="_blank" rel="noopener noreferrer" className="solar-btn-small">
                Open Folder
              </a>
            </div>
          </div>
        </div>
      )}

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
};

export default GfxtabPortfolio;
