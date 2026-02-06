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
    {
      title: 'Neon 3D Orb',
      category: '3D Design',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
      folder: '#'
    },
    {
      title: 'City Manipulation',
      category: 'Photo Manipulation',
      image: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=800',
      folder: '#'
    },
    {
      title: 'Motion Graphics Reel',
      category: 'Motion Design',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
      folder: '#'
    },
    {
      title: 'Logo Design',
      category: 'Brand Identity',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800',
      folder: '#'
    },
    {
      title: 'Digital Invite',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800',
      folder: '#'
    },
    {
      title: 'VFX Compositing',
      category: 'Visual Effects',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800',
      folder: '#'
    }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Simple ambient light
    const ambientLight = new THREE.AmbientLight(0x1a1a3e, 0.5);
    scene.add(ambientLight);

    // Optimized star field (reduced particles)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMat = new THREE.PointsMaterial({
      color: 0x00f6ff,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Gentle camera movement on scroll
    let targetZ = 5;
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        targetZ = 5 - (self.progress * 15);
      }
    });

    // Animation loop with throttle
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const animate = (currentTime) => {
      requestAnimationFrame(animate);
      
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime > interval) {
        lastTime = currentTime - (deltaTime % interval);
        
        // Smooth camera interpolation
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        
        // Slow star rotation
        stars.rotation.y += 0.0002;
        
        renderer.render(scene, camera);
      }
    };
    animate(0);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div className="portfolio-container">
      <canvas ref={canvasRef} className="space-canvas" />
      
      <div className="content-overlay">
        {/* HERO SECTION */}
        <section className="hero-section" data-testid="hero-section">
          <div className="hero-content">
            <div className="brand-mark" data-testid="brand-mark">GFXTAB</div>
            <h1 className="hero-headline" data-testid="hero-headline">
              We Design Visual Experiences<br/>That Define Modern Brands.
            </h1>
            <p className="hero-subline" data-testid="hero-subline">
              GFXTAB is a designer-led creative studio delivering high-impact branding, motion, and digital design for businesses that refuse to look ordinary.
            </p>
            <div className="hero-tagline" data-testid="hero-power-statement">
              Premium by design. Strategic by intention.
            </div>
            <div className="hero-buttons">
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

        {/* SOCIAL PROOF */}
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
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="project-overlay">
                    <span>View Project</span>
                  </div>
                </div>
                <div className="project-info">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-category">{project.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONING */}
        <section className="positioning-section" data-testid="positioning-section">
          <h2 className="positioning-title">Built for Brands That Intend to Lead</h2>
          <div className="positioning-content">
            <p>We partner with ambitious businesses and emerging brands to craft visuals that influence perception and accelerate growth.</p>
            <p>Every detail is deliberate. Every design serves a purpose.</p>
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

        {/* FOUNDER */}
        <section className="founder-section" data-testid="founder-section">
          <div className="founder-logo">
            <img 
              src="https://drive.google.com/uc?export=view&id=1sMjejBtmc5If2PABfdaWv35U3duIu57h" 
              alt="GFXTAB"
            />
          </div>
          <h2 className="section-title">Founder-Led. Detail-Obsessed.</h2>
          <div className="founder-content">
            <p>GFXTAB was founded by <strong>Taiyyab Saiyyad</strong>, a visual designer known for blending strategic clarity with striking aesthetics.</p>
            <p>With over four years of professional experience, his work reflects a commitment to precision, modern design language, and results-driven creativity.</p>
            <div className="founder-quote">
              Good design attracts attention.<br/>
              Exceptional design earns trust.
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="process-section" data-testid="process-section">
          <h2 className="section-title">Process</h2>
          <div className="process-steps">
            {[
              { num: '01', title: 'Discover', desc: 'Understanding your brand, audience, and objectives.' },
              { num: '02', title: 'Define', desc: 'Translating insights into clear creative direction.' },
              { num: '03', title: 'Design', desc: 'Crafting visuals with precision and intention.' },
              { num: '04', title: 'Refine', desc: 'Polishing every detail until it meets studio standards.' },
              { num: '05', title: 'Deliver', desc: 'Production-ready assets built for impact.' }
            ].map((step, i) => (
              <div key={i} className="process-step">
                <div className="step-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="trust-section" data-testid="trust-section">
          <h2 className="section-title">Building Long-Term Creative Partnerships</h2>
          <p className="trust-text">
            Clients value GFXTAB for reliability, refined aesthetics, and a process that respects both timelines and quality.
          </p>
        </section>

        {/* PLATFORMS */}
        <section className="platforms-section" data-testid="platforms-section">
          <h2 className="section-title">Professional Platforms</h2>
          <div className="platforms-grid">
            <a 
              href="https://www.behance.net/taiyyabsaiyyad1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="platform-card"
              data-testid="behance-link"
            >
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
              </div>
              <h3>Behance</h3>
              <p>Portfolio & Case Studies</p>
            </a>
            
            <a 
              href="https://www.instagram.com/gfxtab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="platform-card"
              data-testid="instagram-link"
            >
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3>Instagram</h3>
              <p>Creative Showcase</p>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/taiyyab-saiyyad-031887192" 
              target="_blank" 
              rel="noopener noreferrer"
              className="platform-card"
              data-testid="linkedin-link"
            >
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <h3>LinkedIn</h3>
              <p>Professional Journey</p>
            </a>
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

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>×</button>
            <div className="modal-image">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="modal-details">
              <div>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.category}</p>
              </div>
              <a href={selectedProject.folder} target="_blank" rel="noopener noreferrer" className="btn-secondary-small">
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
