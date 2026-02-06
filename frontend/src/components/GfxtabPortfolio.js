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

  // Your actual projects from the provided code
  const projects = [
    {
      title: 'Neon 3D Orb',
      category: '3D Design',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600',
      folder: 'https://drive.google.com/drive/folders/your-folder-id'
    },
    {
      title: 'City Manipulation',
      category: 'Photo Manipulation',
      image: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1600',
      folder: 'https://drive.google.com/drive/folders/your-folder-id'
    },
    {
      title: 'Promo Reel',
      category: 'Motion Graphics',
      video: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      folder: 'https://drive.google.com/drive/folders/your-folder-id'
    },
    {
      title: 'Logo Concept',
      category: 'Brand Identity',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600',
      folder: 'https://drive.google.com/drive/folders/your-folder-id'
    },
    {
      title: 'Digital Invite Design',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600',
      folder: 'https://drive.google.com/drive/folders/your-folder-id'
    },
    {
      title: 'VFX Compositing',
      category: 'Visual Effects',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600',
      folder: 'https://drive.google.com/drive/your-folder-id'
    }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020207, 0.008);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    camera.position.set(0, 0, 80);

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ENHANCED LIGHTING
    scene.add(new THREE.AmbientLight(0x1a1a2e, 0.4));
    
    const mainLight = new THREE.PointLight(0x00f6ff, 2, 150);
    mainLight.position.set(50, 30, 50);
    scene.add(mainLight);

    const accentLight1 = new THREE.PointLight(0x4facfe, 1.5, 120);
    accentLight1.position.set(-50, -30, 30);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x00d4ff, 1.2, 100);
    accentLight2.position.set(0, 50, 60);
    scene.add(accentLight2);

    // MULTILAYER STAR FIELDS
    const createStarField = (count, spread, size, color, opacity) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < positions.length; i += 3) {
        const radius = spread * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi) - spread * 0.3;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      return new THREE.Points(geometry, material);
    };

    const starField1 = createStarField(5000, 250, 0.2, 0x00f6ff, 0.9);
    const starField2 = createStarField(3000, 180, 0.15, 0x4facfe, 0.7);
    const starField3 = createStarField(2000, 120, 0.1, 0xffffff, 0.5);
    
    scene.add(starField1, starField2, starField3);

    // FLOATING GLASS PANELS (Universe Gates)
    const universeObjects = new THREE.Group();
    scene.add(universeObjects);

    const createGlassPanel = (width, height, x, y, z, rotationY) => {
      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a18,
        roughness: 0.05,
        transmission: 0.8,
        thickness: 2,
        clearcoat: 1,
        emissive: new THREE.Color(0x00f6ff),
        emissiveIntensity: 0.15,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotationY;
      mesh.rotation.x = Math.random() * 0.3;
      return mesh;
    };

    // Create portal-like panels at different depths
    const panelConfigs = [
      { w: 15, h: 10, x: -30, y: 10, z: -40, rot: 0.4 },
      { w: 12, h: 8, x: 35, y: -15, z: -80, rot: -0.5 },
      { w: 18, h: 12, x: -20, y: 25, z: -130, rot: 0.3 },
      { w: 14, h: 9, x: 40, y: -20, z: -180, rot: -0.4 },
      { w: 20, h: 14, x: -35, y: 15, z: -240, rot: 0.5 },
      { w: 16, h: 11, x: 25, y: -30, z: -300, rot: -0.3 },
      { w: 22, h: 15, x: -40, y: 20, z: -360, rot: 0.6 },
      { w: 18, h: 13, x: 30, y: -25, z: -420, rot: -0.5 }
    ];

    panelConfigs.forEach(config => {
      const panel = createGlassPanel(config.w, config.h, config.x, config.y, config.z, config.rot);
      universeObjects.add(panel);
    });

    // CINEMATIC CAMERA JOURNEY (Zooming through space)
    const tl = gsap.timeline({
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2
      }
    });

    tl.to(camera.position, {
      z: -350,
      ease: 'power2.inOut'
    })
    .to(camera.rotation, {
      y: Math.PI * 0.15,
      x: 0.1,
      ease: 'power1.inOut'
    }, 0)
    .to(camera, {
      fov: 90,
      onUpdate: () => camera.updateProjectionMatrix()
    }, 0);

    // TEXT ANIMATIONS WITH SPACE EFFECTS
    gsap.to('#heroSection', {
      opacity: 0,
      y: -100,
      scrollTrigger: {
        start: 'top top',
        end: '15% top',
        scrub: true
      }
    });

    // Animate sections as they come into view
    const animateSections = () => {
      const sections = [
        '.proof-strip',
        '.work-section',
        '.positioning-section',
        '.capabilities-section',
        '.founder-section',
        '.process-section',
        '.platforms-section',
        '.final-cta'
      ];

      sections.forEach((selector, index) => {
        gsap.from(selector, {
          scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 60,
          scale: 0.95,
          duration: 1.2,
          ease: 'power3.out'
        });
      });
    };

    animateSections();

    // ANIMATION LOOP
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;
      
      // Rotate star fields
      starField1.rotation.y += 0.0004;
      starField1.rotation.x += 0.0002;
      
      starField2.rotation.y -= 0.0003;
      starField2.rotation.x += 0.00025;
      
      starField3.rotation.y += 0.0005;
      starField3.rotation.x -= 0.0001;
      
      // Animate universe objects
      universeObjects.children.forEach((obj, i) => {
        obj.rotation.y += 0.0015 * (i % 2 === 0 ? 1 : -1);
        obj.rotation.x += Math.sin(time + i) * 0.0005;
        obj.position.y += Math.sin(time * 1.5 + i) * 0.03;
      });
      
      // Pulse lights
      mainLight.intensity = 2 + Math.sin(time * 2) * 0.4;
      accentLight1.intensity = 1.5 + Math.cos(time * 1.8) * 0.3;
      accentLight2.intensity = 1.2 + Math.sin(time * 2.2) * 0.25;
      
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

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />
      
      <div className="content-wrapper">
        {/* HERO SECTION */}
        <section className="hero-section" id="heroSection" data-testid="hero-section">
          <div className="hero-content">
            <div className="brand-mark space-text" data-testid="brand-mark">GFXTAB</div>
            <h1 className="hero-headline space-text" data-testid="hero-headline">
              We Design Visual Experiences<br/>That Define Modern Brands.
            </h1>
            <p className="hero-subline space-text" data-testid="hero-subline">
              GFXTAB is a designer-led creative studio delivering high-impact branding, motion, and digital design for businesses that refuse to look ordinary.
            </p>
            <div className="hero-power-statement space-text" data-testid="hero-power-statement">
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
              <div 
                key={index} 
                className="project-card" 
                data-testid={`project-card-${index}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-media">
                  {project.video ? (
                    <video src={project.video} muted loop autoplay playsInline />
                  ) : (
                    <img src={project.image} alt={project.title} loading="lazy" />
                  )}
                </div>
                <div className="project-info">
                  <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-category">{project.category}</p>
                </div>
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
              <p>Modern, conversion-aware design tailored for today platforms.</p>
            </div>
            
            <div className="capability-item">
              <h3>Photo Manipulation</h3>
              <p>High-detail compositions that transform concepts into powerful visuals.</p>
            </div>
          </div>
        </section>

        {/* FOUNDER SECTION */}
        <section className="founder-section" data-testid="founder-section">
          <div className="founder-logo">
            <img 
              src="https://drive.google.com/uc?export=view&id=1sMjejBtmc5If2PABfdaWv35U3duIu57h" 
              alt="GFXTAB Logo"
            />
          </div>
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
              <div className="platform-icon-svg">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
              </div>
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
              <div className="platform-icon-svg">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
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
              <div className="platform-icon-svg">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
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

      {/* PROJECT PREVIEW MODAL */}
      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedProject(null)}>×</button>
            <div className="project-preview-media">
              {selectedProject.video ? (
                <video src={selectedProject.video} controls autoPlay />
              ) : (
                <img src={selectedProject.image} alt={selectedProject.title} />
              )}
            </div>
            <div className="project-preview-footer">
              <div>
                <strong>{selectedProject.title}</strong>
                <p>{selectedProject.category}</p>
              </div>
              <div className="project-preview-actions">
                <a href={selectedProject.folder} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Open Folder
                </a>
              </div>
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
