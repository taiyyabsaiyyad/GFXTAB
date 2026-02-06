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
    scene.fog = new THREE.FogExp2(0x020207, 0.015);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // AMBIENT LIGHTING
    scene.add(new THREE.AmbientLight(0x1a1a2e, 0.3));
    
    // NEON LIGHTS (Multiple for depth)
    const neonLight1 = new THREE.PointLight(0x00f6ff, 1.5, 100);
    neonLight1.position.set(30, 20, 30);
    scene.add(neonLight1);

    const neonLight2 = new THREE.PointLight(0x4facfe, 1, 80);
    neonLight2.position.set(-30, -20, 20);
    scene.add(neonLight2);

    const accentLight = new THREE.PointLight(0x00d4ff, 0.8, 60);
    accentLight.position.set(0, 0, 40);
    scene.add(accentLight);

    // STAR FIELD (Multiple layers for depth)
    const createStarField = (count, spread, size, color, opacity) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread;
        positions[i + 1] = (Math.random() - 0.5) * spread;
        positions[i + 2] = (Math.random() - 0.5) * spread;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending
      });
      
      return new THREE.Points(geometry, material);
    };

    const starField1 = createStarField(3000, 200, 0.15, 0x00f6ff, 0.8);
    const starField2 = createStarField(2000, 150, 0.1, 0x4facfe, 0.6);
    const starField3 = createStarField(1500, 100, 0.08, 0xffffff, 0.4);
    
    scene.add(starField1);
    scene.add(starField2);
    scene.add(starField3);

    // FLOATING GEOMETRIC SHAPES (Universe objects)
    const universeObjects = new THREE.Group();
    scene.add(universeObjects);

    const createGlassPanel = (width, height, x, y, z, rotationY) => {
      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a15,
        roughness: 0.1,
        transmission: 0.7,
        thickness: 1.5,
        clearcoat: 1,
        emissive: new THREE.Color(0x00f6ff),
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotationY;
      return mesh;
    };

    // Create floating panels at different depths
    for (let i = 0; i < 8; i++) {
      const panel = createGlassPanel(
        8 + Math.random() * 4,
        5 + Math.random() * 3,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        -i * 30 - 20,
        Math.random() * Math.PI
      );
      universeObjects.add(panel);
    }

    // CAMERA JOURNEY THROUGH SPACE
    gsap.to(camera.position, {
      z: -180,
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      }
    });

    // Camera rotation for immersive feel
    gsap.to(camera.rotation, {
      y: 0.3,
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2
      }
    });

    // HERO FADE
    gsap.to('#heroSection', {
      opacity: 0,
      scrollTrigger: {
        start: 'top top',
        end: '20% top',
        scrub: true
      }
    });

    // ANIMATION LOOP
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;
      
      // Rotate star fields at different speeds
      starField1.rotation.y += 0.0003;
      starField1.rotation.x += 0.0001;
      
      starField2.rotation.y -= 0.0002;
      starField2.rotation.x += 0.00015;
      
      starField3.rotation.y += 0.00025;
      
      // Animate universe objects
      universeObjects.children.forEach((obj, i) => {
        obj.rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1);
        obj.rotation.x = Math.sin(time + i) * 0.1;
        obj.position.y += Math.sin(time * 2 + i) * 0.02;
      });
      
      // Animate lights
      neonLight1.intensity = 1.5 + Math.sin(time * 2) * 0.3;
      neonLight2.intensity = 1 + Math.cos(time * 1.5) * 0.2;
      
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const projects = [
    { title: 'Brand Identity Systems', category: 'Branding', desc: 'Strategic visual systems designed for recognition and long-term brand equity.' },
    { title: 'Motion Graphics', category: 'Animation', desc: 'Cinematic visuals engineered to capture attention in fast-moving digital spaces.' },
    { title: 'Digital Creatives', category: 'Design', desc: 'Modern, conversion-aware design tailored for today platforms.' },
    { title: 'Photo Manipulation', category: 'Art Direction', desc: 'High-detail compositions that transform concepts into powerful visuals.' },
    { title: 'Social Media Assets', category: 'Content', desc: 'Platform-optimized visuals that drive engagement and brand consistency.' },
    { title: 'VFX & Compositing', category: 'Visual Effects', desc: 'Professional-grade effects that elevate storytelling and production value.' }
  ];

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />
      
      <div className="content-wrapper">
        {/* HERO SECTION */}
        <section className="hero-section" id="heroSection" data-testid="hero-section">
          <div className="hero-content">
            <div className="brand-mark" data-testid="brand-mark">GFXTAB</div>
            <h1 className="hero-headline" data-testid="hero-headline">
              We Design Visual Experiences<br/>That Define Modern Brands.
            </h1>
            <p className="hero-subline" data-testid="hero-subline">
              GFXTAB is a designer-led creative studio delivering high-impact branding, motion, and digital design for businesses that refuse to look ordinary.
            </p>
            <div className="hero-power-statement" data-testid="hero-power-statement">
              Premium by design. Strategic by intention.
            </div>
            <div className="hero-actions">
              <button 
                className="btn-primary" 
                data-testid="start-project-btn-hero"
                onClick={() => setShowContactForm(true)}
              >
                Start a Project
              </button>
              <button 
                className="btn-secondary" 
                data-testid="view-work-btn"
                onClick={() => document.getElementById('workSection').scrollIntoView({ behavior: 'smooth' })}
              >
                View Selected Work
              </button>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF STRIP */}
        <section className="proof-strip" data-testid="proof-strip">
          <div className="proof-item">
            <div className="proof-number">120+</div>
            <div className="proof-label">Projects Delivered</div>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-item">
            <div className="proof-number">4+</div>
            <div className="proof-label">Years Expertise</div>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-item">
            <div className="proof-number">Studio-Level</div>
            <div className="proof-label">Execution</div>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-item">
            <div className="proof-number">Trusted</div>
            <div className="proof-label">by Brands & Creators</div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section className="work-section" id="workSection" data-testid="work-section">
          <div className="section-header">
            <h2 className="section-title" data-testid="work-title">Selected Work</h2>
            <p className="section-subtitle">
              A refined selection of projects demonstrating strategic thinking, modern aesthetics, and meticulous execution.
            </p>
            <div className="section-quote">Great brands are not accidental. They are designed.</div>
          </div>
          
          <div className="work-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card" data-testid={`project-card-${index}`}>
                <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
                <p className="project-desc">{project.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONING SECTION */}
        <section className="positioning-section" data-testid="positioning-section">
          <h2 className="positioning-title">Built for Brands That Intend to Lead</h2>
          <div className="positioning-content">
            <p>
              We partner with ambitious businesses and emerging brands to craft visuals that influence perception and accelerate growth.
            </p>
            <p>
              Every detail is deliberate.<br/>
              Every design serves a purpose.
            </p>
            <p className="positioning-closer">Not decoration. Direction.</p>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="capabilities-section" data-testid="capabilities-section">
          <h2 className="section-title">Capabilities</h2>
          
          <div className="capabilities-grid">
            <div className="capability-item">
              <h3>Brand Identity</h3>
              <p>Strategic visual systems designed for recognition and long-term brand equity.</p>
            </div>
            
            <div className="capability-item">
              <h3>Motion Design</h3>
              <p>Cinematic visuals engineered to capture attention in fast-moving digital spaces.</p>
            </div>
            
            <div className="capability-item">
              <h3>Digital Creatives</h3>
              <p>Modern, conversion-aware design tailored for today's platforms.</p>
            </div>
            
            <div className="capability-item">
              <h3>Photo Manipulation</h3>
              <p>High-detail compositions that transform concepts into powerful visuals.</p>
            </div>
          </div>
        </section>

        {/* FOUNDER SECTION */}
        <section className="founder-section" data-testid="founder-section">
          <h2 className="section-title">Founder-Led. Detail-Obsessed.</h2>
          <div className="founder-content">
            <p>
              GFXTAB was founded by <strong>Taiyyab Saiyyad</strong>, a visual designer known for blending strategic clarity with striking aesthetics.
            </p>
            <p>
              With over four years of professional experience, his work reflects a commitment to precision, modern design language, and results-driven creativity.
            </p>
            <div className="founder-quote">
              Good design attracts attention.<br/>
              Exceptional design earns trust.
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="process-section" data-testid="process-section">
          <h2 className="section-title">Process</h2>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <h3>Discover</h3>
              <p>Understanding your brand, audience, and objectives.</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">02</div>
              <h3>Define</h3>
              <p>Translating insights into clear creative direction.</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">03</div>
              <h3>Design</h3>
              <p>Crafting visuals with precision and intention.</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">04</div>
              <h3>Refine</h3>
              <p>Polishing every detail until it meets studio standards.</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">05</div>
              <h3>Deliver</h3>
              <p>Production-ready assets built for impact.</p>
            </div>
          </div>
        </section>

        {/* TRUST BLOCK */}
        <section className="trust-section" data-testid="trust-section">
          <h2 className="section-title">Building Long-Term Creative Partnerships</h2>
          <p className="trust-text">
            Clients value GFXTAB for reliability, refined aesthetics, and a process that respects both timelines and quality.
          </p>
        </section>

        {/* PROFESSIONAL PLATFORMS */}
        <section className="platforms-section" data-testid="platforms-section">
          <h2 className="section-title">Professional Platforms</h2>
          
          <div className="platforms-grid">
            <div className="platform-card">
              <div className="platform-icon">🎨</div>
              <h3>Behance — Portfolio & Case Studies</h3>
              <p>Explore detailed projects, creative breakdowns, and studio-quality executions.</p>
              <a 
                href="https://www.behance.net/taiyyabsaiyyad1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="platform-link"
                data-testid="behance-link"
              >
                View Portfolio →
              </a>
            </div>
            
            <div className="platform-card">
              <div className="platform-icon">📸</div>
              <h3>Instagram — Creative Showcase</h3>
              <p>A live stream of trending reels, motion edits, design experiments, and visual storytelling.</p>
              <a 
                href="https://www.instagram.com/gfxtab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="platform-link"
                data-testid="instagram-link"
              >
                Follow GFXTAB →
              </a>
            </div>
            
            <div className="platform-card">
              <div className="platform-icon">💼</div>
              <h3>LinkedIn — Professional Journey</h3>
              <p>Experience, collaborations, career milestones, and professional credibility in one place.</p>
              <a 
                href="https://www.linkedin.com/in/taiyyab-saiyyad-031887192" 
                target="_blank" 
                rel="noopener noreferrer"
                className="platform-link"
                data-testid="linkedin-link"
              >
                Connect on LinkedIn →
              </a>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta" data-testid="final-cta">
          <h2 className="cta-title">Let's Create Something Remarkable</h2>
          <p className="cta-text">
            Whether you are launching a brand, elevating your presence, or redefining your visual identity, the right design can transform perception.
          </p>
          <p className="cta-subtext">Start the conversation.</p>
          
          <button 
            className="btn-primary-large" 
            data-testid="start-project-btn-cta"
            onClick={() => setShowContactForm(true)}
          >
            Start a Project
          </button>
          
          <p className="cta-notice">Currently accepting select projects.</p>
        </section>

        {/* FOOTER */}
        <footer className="footer" data-testid="footer">
          <p>© 2025 GFXTAB — Crafted by Taiyyab Saiyyad</p>
          <p className="footer-tagline">Where visuals meet intention.</p>
        </footer>
      </div>

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
};

export default GfxtabPortfolio;
