import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactForm from './ContactForm';

gsap.registerPlugin(ScrollTrigger);

const GfxtabPortfolio = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
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
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING SETUP
    const ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f6ff, 2, 500);
    pointLight1.position.set(100, 100, 100);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 400);
    pointLight2.position.set(-100, -100, -50);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x00ffff, 1, 300);
    pointLight3.position.set(0, -200, 150);
    scene.add(pointLight3);

    // MULTI-LAYER STAR SYSTEMS
    const createStarLayer = (count, spread, size, color, depth) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      for (let i = 0; i < count * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = spread * (0.5 + Math.random() * 0.5);
        
        positions[i] = Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * spread;
        positions[i + 2] = Math.sin(angle) * radius - depth;
        
        const colorVariation = 0.7 + Math.random() * 0.3;
        colors[i] = color.r * colorVariation;
        colors[i + 1] = color.g * colorVariation;
        colors[i + 2] = color.b * colorVariation;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      return new THREE.Points(geometry, material);
    };

    const starLayers = [
      createStarLayer(1500, 400, 0.3, { r: 0, g: 0.96, b: 1 }, 0),
      createStarLayer(1200, 350, 0.25, { r: 0.5, g: 0.7, b: 1 }, 200),
      createStarLayer(1000, 300, 0.2, { r: 1, g: 0.5, b: 1 }, 400),
      createStarLayer(800, 250, 0.15, { r: 1, g: 1, b: 1 }, 600)
    ];
    
    starLayers.forEach(layer => scene.add(layer));

    // NEBULA CLOUDS
    const nebulaGroup = new THREE.Group();
    
    const createNebula = (x, y, z, size, color) => {
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.03,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.set(x, y, z);
      return nebula;
    };

    nebulaGroup.add(createNebula(100, 50, -200, 150, 0xff00ff));
    nebulaGroup.add(createNebula(-120, -80, -400, 180, 0x00ffff));
    nebulaGroup.add(createNebula(80, -100, -600, 200, 0x0088ff));
    nebulaGroup.add(createNebula(-150, 120, -800, 220, 0xff0088));
    
    scene.add(nebulaGroup);

    // FLOATING ENERGY ORBS
    const energyOrbs = [];
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 3 + 1, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const orb = new THREE.Mesh(geometry, material);
      orb.position.set(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        -Math.random() * 800 - 100
      );
      orb.userData.speed = Math.random() * 0.002 + 0.001;
      energyOrbs.push(orb);
      scene.add(orb);
    }

    // COSMIC PORTAL RINGS
    const createPortalRing = (radius, z, color) => {
      const geometry = new THREE.TorusGeometry(radius, 1, 16, 100);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.position.z = z;
      ring.rotation.x = Math.PI / 2;
      return ring;
    };

    const portalRings = [
      createPortalRing(50, -300, 0x00ffff),
      createPortalRing(70, -600, 0xff00ff),
      createPortalRing(90, -900, 0x00f6ff)
    ];
    
    portalRings.forEach(ring => scene.add(ring));

    // MOUSE/TOUCH INTERACTION
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // SCROLL-BASED CAMERA JOURNEY
    let targetCameraZ = 100;
    let targetCameraY = 0;
    let targetRotationY = 0;

    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        targetCameraZ = 100 - (progress * 800);
        targetCameraY = Math.sin(progress * Math.PI * 2) * 30;
        targetRotationY = progress * Math.PI * 0.3;
      }
    });

    // ANIMATION LOOP
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Smooth camera interpolation (5D movement feel)
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;
      
      // Mouse parallax effect
      camera.position.x += (mouseRef.current.x * 20 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 10 - (targetCameraY + camera.position.y)) * 0.03;
      
      // Rotate star layers at different speeds
      starLayers.forEach((layer, i) => {
        layer.rotation.y += 0.0001 * (i + 1);
        layer.rotation.x += 0.00005 * (i + 1);
      });
      
      // Animate nebula clouds
      nebulaGroup.rotation.y += 0.0002;
      nebulaGroup.rotation.x = Math.sin(time * 0.1) * 0.1;
      
      // Pulse energy orbs
      energyOrbs.forEach((orb, i) => {
        orb.position.y += Math.sin(time + i) * 0.05;
        orb.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
        orb.rotation.y += orb.userData.speed;
      });
      
      // Spin portal rings
      portalRings.forEach((ring, i) => {
        ring.rotation.z += 0.001 * (i + 1);
        ring.scale.setScalar(1 + Math.sin(time + i) * 0.05);
      });
      
      // Pulse lights
      pointLight1.intensity = 2 + Math.sin(time) * 0.5;
      pointLight2.intensity = 1.5 + Math.cos(time * 1.5) * 0.3;
      pointLight3.intensity = 1 + Math.sin(time * 2) * 0.2;
      
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    // TEXT ANIMATIONS
    gsap.fromTo('.cosmic-text',
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.15
      }
    );

    // Floating animation for hero elements
    gsap.to('.float-element', {
      y: -15,
      duration: 2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.3
    });

    // Section entrance animations
    const sections = document.querySelectorAll('.cosmic-section');
    sections.forEach((section, i) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 80,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out'
      });
    });
  }, []);

  return (
    <div className="cosmic-portfolio">
      <canvas ref={canvasRef} className="cosmic-canvas" />
      
      <div className="content-journey">
        {/* HERO - SPIRITUAL ENERGY SECTION */}
        <section className="hero-cosmic" data-testid="hero-section">
          <div className="spiritual-aura"></div>
          <div className="hero-silhouette"></div>
          
          <div className="hero-cosmic-content">
            <div className="brand-cosmic cosmic-text float-element" data-testid="brand-mark">
              GFXTAB
            </div>
            <h1 className="hero-cosmic-title cosmic-text float-element" data-testid="hero-headline">
              <span className="glitch-text" data-text="We Design Visual Experiences">We Design Visual Experiences</span><br/>
              <span className="glitch-text" data-text="That Define Modern Brands">That Define Modern Brands</span>
            </h1>
            <p className="hero-cosmic-sub cosmic-text float-element" data-testid="hero-subline">
              Journey through creativity. Where imagination meets execution in a cosmic dance of pixels, motion, and meaning.
            </p>
            <div className="hero-tagline cosmic-text float-element" data-testid="hero-power-statement">
              Premium by design. Strategic by intention.
            </div>
            <div className="hero-actions cosmic-text">
              <button 
                className="btn-cosmic-primary" 
                data-testid="start-project-btn-hero"
                onClick={() => setShowContactForm(true)}
              >
                <span>Start a Project</span>
                <div className="btn-glow"></div>
              </button>
              <button 
                className="btn-cosmic-secondary" 
                data-testid="view-work-btn"
                onClick={() => document.getElementById('workSection').scrollIntoView({ behavior: 'smooth' })}
              >
                <span>View Selected Work</span>
              </button>
            </div>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section className="proof-cosmic cosmic-section" data-testid="proof-strip">
          <div className="proof-cosmic-item">
            <div className="proof-number-cosmic">120+</div>
            <div className="proof-label-cosmic">Projects Delivered</div>
          </div>
          <div className="cosmic-divider"></div>
          <div className="proof-cosmic-item">
            <div className="proof-number-cosmic">4+</div>
            <div className="proof-label-cosmic">Years Expertise</div>
          </div>
          <div className="cosmic-divider"></div>
          <div className="proof-cosmic-item">
            <div className="proof-number-cosmic">Studio-Level</div>
            <div className="proof-label-cosmic">Execution</div>
          </div>
        </section>

        {/* WORK SECTION - GALAXY CARDS */}
        <section className="work-cosmic cosmic-section" id="workSection" data-testid="work-section">
          <div className="section-cosmic-header">
            <h2 className="section-cosmic-title" data-testid="work-title">
              <span className="gradient-text">Selected Work</span>
            </h2>
            <p className="section-cosmic-subtitle">
              Navigate through our cosmic portfolio. Each project is a star in our creative universe.
            </p>
            <div className="section-cosmic-quote">Great brands are not accidental. They are designed.</div>
          </div>
          
          <div className="work-cosmic-grid">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="project-cosmic-card" 
                data-testid={`project-card-${index}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-cosmic-glow"></div>
                <div className="project-cosmic-media">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="project-cosmic-overlay">
                    <span className="view-text">Enter Universe</span>
                  </div>
                </div>
                <div className="project-cosmic-info">
                  <h3 className="project-cosmic-title">{project.title}</h3>
                  <p className="project-cosmic-category">{project.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONING */}
        <section className="positioning-cosmic cosmic-section" data-testid="positioning-section">
          <div className="cosmic-energy-bg"></div>
          <h2 className="positioning-cosmic-title gradient-text">
            Built for Brands That Intend to Lead
          </h2>
          <div className="positioning-cosmic-content">
            <p>We partner with ambitious businesses and emerging brands to craft visuals that influence perception and accelerate growth.</p>
            <p>Every detail is deliberate. Every design serves a purpose.</p>
            <p className="positioning-cosmic-closer">Not decoration. Direction.</p>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="capabilities-cosmic cosmic-section" data-testid="capabilities-section">
          <h2 className="section-cosmic-title gradient-text">Capabilities</h2>
          <div className="capabilities-cosmic-grid">
            {[
              { title: 'Brand Identity', desc: 'Strategic visual systems designed for recognition and long-term brand equity.' },
              { title: 'Motion Design', desc: 'Cinematic visuals engineered to capture attention in fast-moving digital spaces.' },
              { title: 'Digital Creatives', desc: 'Modern, conversion-aware design tailored for today platforms.' },
              { title: 'Photo Manipulation', desc: 'High-detail compositions that transform concepts into powerful visuals.' }
            ].map((cap, i) => (
              <div key={i} className="capability-cosmic-item">
                <div className="capability-cosmic-icon"></div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER */}
        <section className="founder-cosmic cosmic-section" data-testid="founder-section">
          <div className="founder-cosmic-aura"></div>
          <div className="founder-cosmic-logo">
            <img 
              src="https://drive.google.com/uc?export=view&id=1sMjejBtmc5If2PABfdaWv35U3duIu57h" 
              alt="GFXTAB"
            />
          </div>
          <h2 className="section-cosmic-title gradient-text">Founder-Led. Detail-Obsessed.</h2>
          <div className="founder-cosmic-content">
            <p>GFXTAB was founded by <strong>Taiyyab Saiyyad</strong>, a visual designer known for blending strategic clarity with striking aesthetics.</p>
            <p>With over four years of professional experience, his work reflects a commitment to precision, modern design language, and results-driven creativity.</p>
            <div className="founder-cosmic-quote">
              Good design attracts attention.<br/>
              Exceptional design earns trust.
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="process-cosmic cosmic-section" data-testid="process-section">
          <h2 className="section-cosmic-title gradient-text">Process</h2>
          <div className="process-cosmic-steps">
            {[
              { num: '01', title: 'Discover', desc: 'Understanding your brand, audience, and objectives.' },
              { num: '02', title: 'Define', desc: 'Translating insights into clear creative direction.' },
              { num: '03', title: 'Design', desc: 'Crafting visuals with precision and intention.' },
              { num: '04', title: 'Refine', desc: 'Polishing every detail until it meets studio standards.' },
              { num: '05', title: 'Deliver', desc: 'Production-ready assets built for impact.' }
            ].map((step, i) => (
              <div key={i} className="process-cosmic-step">
                <div className="step-cosmic-orb"></div>
                <div className="step-cosmic-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="trust-cosmic cosmic-section" data-testid="trust-section">
          <h2 className="section-cosmic-title gradient-text">Building Long-Term Creative Partnerships</h2>
          <p className="trust-cosmic-text">
            Clients value GFXTAB for reliability, refined aesthetics, and a process that respects both timelines and quality.
          </p>
        </section>

        {/* PLATFORMS */}
        <section className="platforms-cosmic cosmic-section" data-testid="platforms-section">
          <h2 className="section-cosmic-title gradient-text">Professional Platforms</h2>
          <div className="platforms-cosmic-grid">
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
                className="platform-cosmic-card"
                data-testid={platform.testid}
              >
                <div className="platform-cosmic-icon">{platform.icon}</div>
                <h3>{platform.name}</h3>
                <p>{platform.desc}</p>
                <div className="platform-cosmic-shine"></div>
              </a>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="cta-cosmic cosmic-section" data-testid="final-cta">
          <div className="cta-cosmic-aura"></div>
          <h2 className="cta-cosmic-title gradient-text">Let's Create Something Remarkable</h2>
          <p className="cta-cosmic-text">
            Whether you are launching a brand, elevating your presence, or redefining your visual identity, the right design can transform perception.
          </p>
          <p className="cta-cosmic-subtext">Start the conversation.</p>
          <button 
            className="btn-cosmic-primary-large" 
            data-testid="start-project-btn-cta"
            onClick={() => setShowContactForm(true)}
          >
            <span>Start a Project</span>
            <div className="btn-glow"></div>
          </button>
          <p className="cta-cosmic-notice">Currently accepting select projects.</p>
        </section>

        {/* FOOTER */}
        <footer className="footer-cosmic" data-testid="footer">
          <p>© 2025 GFXTAB — Crafted by Taiyyab Saiyyad</p>
          <p className="footer-cosmic-tagline">Where visuals meet the cosmos.</p>
        </footer>
      </div>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="modal-cosmic-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-cosmic-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cosmic-close" onClick={() => setSelectedProject(null)}>×</button>
            <div className="modal-cosmic-image">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="modal-cosmic-details">
              <div>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.category}</p>
              </div>
              <a href={selectedProject.folder} target="_blank" rel="noopener noreferrer" className="btn-cosmic-secondary-small">
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
