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
    
    // Deep space background
    scene.background = new THREE.Color(0x000005);
    scene.fog = new THREE.FogExp2(0x000005, 0.0003);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 0, 300);

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING - Much brighter for visibility
    const ambientLight = new THREE.AmbientLight(0x404080, 1);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3, 2000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x00ddff, 2, 1500);
    blueLight.position.set(500, 0, -500);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xff00ff, 2, 1500);
    purpleLight.position.set(-500, 0, -500);
    scene.add(purpleLight);

    // SPIRAL GALAXY
    const createSpiralGalaxy = () => {
      const geometry = new THREE.BufferGeometry();
      const count = 15000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 800 + 200;
        const spinAngle = radius * 0.005;
        const branchAngle = ((i % 6) / 6) * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;
        
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 1000;
        
        const colorInside = new THREE.Color('#00ffff');
        const colorOutside = new THREE.Color('#0033ff');
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / 1000);
        
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 4,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      return new THREE.Points(geometry, material);
    };

    const galaxy = createSpiralGalaxy();
    scene.add(galaxy);

    // COLORFUL NEBULA CLOUDS
    const createNebula = (x, y, z, size, color, opacity) => {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.set(x, y, z);
      return nebula;
    };

    // Multiple colorful nebulas
    const nebulas = [];
    nebulas.push(createNebula(200, 100, -400, 200, 0xff0088, 0.15));
    nebulas.push(createNebula(-250, -80, -600, 250, 0x00ffff, 0.12));
    nebulas.push(createNebula(150, -120, -800, 280, 0x8800ff, 0.18));
    nebulas.push(createNebula(-200, 150, -1000, 300, 0x00ff88, 0.14));
    nebulas.push(createNebula(300, -100, -1200, 320, 0xff00ff, 0.16));
    nebulas.forEach(n => scene.add(n));

    // BRIGHT STARS
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 8000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 3000;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 3000;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        starColors[i3] = 0.3 + Math.random() * 0.7;
        starColors[i3 + 1] = 0.6 + Math.random() * 0.4;
        starColors[i3 + 2] = 1;
      } else if (colorChoice < 0.6) {
        starColors[i3] = 1;
        starColors[i3 + 1] = 0.8 + Math.random() * 0.2;
        starColors[i3 + 2] = 0.8 + Math.random() * 0.2;
      } else {
        starColors[i3] = 1;
        starColors[i3 + 1] = 0.3 + Math.random() * 0.4;
        starColors[i3 + 2] = 0.6 + Math.random() * 0.4;
      }
      
      starSizes[i] = Math.random() * 4 + 1;
    }
    
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starsGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    const starsMat = new THREE.PointsMaterial({
      size: 3,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // EARTH with glow
    const earthGeo = new THREE.SphereGeometry(40, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x2244ff,
      emissive: 0x002288,
      emissiveIntensity: 0.3,
      shininess: 30,
      specular: 0x4488ff
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(-200, -50, -400);
    scene.add(earth);

    // Earth atmosphere glow
    const glowGeo = new THREE.SphereGeometry(42, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const earthGlow = new THREE.Mesh(glowGeo, glowMat);
    earth.add(earthGlow);

    // MOON
    const moonGeo = new THREE.SphereGeometry(10, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      emissive: 0x444444,
      shininess: 5
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-150, -50, -350);
    scene.add(moon);

    // MARS
    const marsGeo = new THREE.SphereGeometry(20, 48, 48);
    const marsMat = new THREE.MeshPhongMaterial({
      color: 0xff4422,
      emissive: 0x661100,
      emissiveIntensity: 0.2,
      shininess: 15
    });
    const mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.set(300, -80, -700);
    scene.add(mars);

    // SATURN with bright rings
    const saturnGeo = new THREE.SphereGeometry(50, 64, 64);
    const saturnMat = new THREE.MeshPhongMaterial({
      color: 0xffcc77,
      emissive: 0x664422,
      emissiveIntensity: 0.2,
      shininess: 20
    });
    const saturn = new THREE.Mesh(saturnGeo, saturnMat);
    saturn.position.set(-400, 100, -1100);
    scene.add(saturn);

    const ringGeo = new THREE.RingGeometry(60, 100, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffdd99,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    saturn.add(ring);

    // COLORFUL ENERGY PARTICLES
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 2000;
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePos[i3] = (Math.random() - 0.5) * 2000;
      particlePos[i3 + 1] = (Math.random() - 0.5) * 1000;
      particlePos[i3 + 2] = Math.random() * -2000;
      
      const hue = Math.random();
      if (hue < 0.33) {
        particleColors[i3] = 0;
        particleColors[i3 + 1] = 0.8 + Math.random() * 0.2;
        particleColors[i3 + 2] = 1;
      } else if (hue < 0.66) {
        particleColors[i3] = 1;
        particleColors[i3 + 1] = 0;
        particleColors[i3 + 2] = 0.8 + Math.random() * 0.2;
      } else {
        particleColors[i3] = 0.8 + Math.random() * 0.2;
        particleColors[i3 + 1] = 0;
        particleColors[i3 + 2] = 1;
      }
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMat = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // SCROLL CAMERA JOURNEY
    let targetZ = 300;
    let targetY = 0;
    let targetRotY = 0;

    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        targetZ = 300 - (progress * 2000);
        targetY = Math.sin(progress * Math.PI * 3) * 100;
        targetRotY = progress * Math.PI * 0.2;
      }
    });

    // ANIMATION LOOP
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;
      
      galaxy.rotation.y += 0.0002;
      galaxy.rotation.z += 0.0001;
      
      nebulas.forEach((nebula, i) => {
        nebula.rotation.y += 0.0001 * (i + 1);
        nebula.scale.setScalar(1 + Math.sin(time + i) * 0.05);
      });
      
      earth.rotation.y += 0.002;
      mars.rotation.y += 0.0015;
      saturn.rotation.y += 0.001;
      
      moon.position.x = earth.position.x + Math.cos(time * 0.5) * 80;
      moon.position.z = earth.position.z + Math.sin(time * 0.5) * 80;
      
      particles.rotation.y += 0.0003;
      
      stars.rotation.y += 0.00005;
      
      blueLight.intensity = 2 + Math.sin(time) * 0.5;
      purpleLight.intensity = 2 + Math.cos(time * 1.3) * 0.5;
      
      renderer.render(scene, camera);
    };
    animate();

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

  // SECTION ANIMATIONS
  useEffect(() => {
    // Hero entrance
    gsap.from('.galaxy-hero-content > *', {
      opacity: 0,
      y: 60,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Animate each section on scroll
    const sections = [
      '.galaxy-proof',
      '.galaxy-work',
      '.galaxy-positioning',
      '.galaxy-capabilities',
      '.galaxy-founder',
      '.galaxy-process',
      '.galaxy-trust',
      '.galaxy-platforms',
      '.galaxy-cta'
    ];

    sections.forEach((selector, index) => {
      gsap.from(selector, {
        scrollTrigger: {
          trigger: selector,
          start: 'top 85%',
          end: 'top 40%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 100,
        scale: 0.9,
        duration: 1.2,
        ease: 'power3.out'
      });
    });

    // Cards stagger animation
    gsap.from('.galaxy-project-card', {
      scrollTrigger: {
        trigger: '.galaxy-work-grid',
        start: 'top 80%'
      },
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)'
    });

    gsap.from('.galaxy-cap-item', {
      scrollTrigger: {
        trigger: '.galaxy-cap-grid',
        start: 'top 80%'
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });

    gsap.from('.galaxy-process-step', {
      scrollTrigger: {
        trigger: '.galaxy-process-grid',
        start: 'top 80%'
      },
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      stagger: 0.12,
      ease: 'back.out(1.5)'
    });

    gsap.from('.galaxy-platform-card', {
      scrollTrigger: {
        trigger: '.galaxy-platforms-grid',
        start: 'top 80%'
      },
      opacity: 0,
      y: 60,
      rotateY: -15,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, []);

  return (
    <div className="galaxy-portfolio">
      <canvas ref={canvasRef} className="galaxy-canvas" />
      
      <div className="galaxy-content">
        {/* HERO */}
        <section className="galaxy-hero" data-testid="hero-section">
          <div className="galaxy-hero-content">
            <div className="galaxy-brand" data-testid="brand-mark">GFXTAB</div>
            <h1 className="galaxy-title" data-testid="hero-headline">
              We Design Visual Experiences<br/>That Define Modern Brands
            </h1>
            <p className="galaxy-subtitle" data-testid="hero-subline">
              Journey through the cosmos of creativity. Where imagination meets execution in a stellar dance of design.
            </p>
            <div className="galaxy-tagline" data-testid="hero-power-statement">
              Premium by design. Strategic by intention.
            </div>
            <div className="galaxy-buttons">
              <button 
                className="galaxy-btn-primary" 
                data-testid="start-project-btn-hero"
                onClick={() => setShowContactForm(true)}
              >
                Start a Project
              </button>
              <button 
                className="galaxy-btn-secondary" 
                data-testid="view-work-btn"
                onClick={() => document.getElementById('workSection').scrollIntoView({ behavior: 'smooth' })}
              >
                View Selected Work
              </button>
            </div>
          </div>
        </section>

        {/* PROOF */}
        <section className="galaxy-proof" data-testid="proof-strip">
          <div className="galaxy-proof-item">
            <div className="galaxy-proof-num">120+</div>
            <div className="galaxy-proof-label">Projects Delivered</div>
          </div>
          <div className="galaxy-divider"></div>
          <div className="galaxy-proof-item">
            <div className="galaxy-proof-num">4+</div>
            <div className="galaxy-proof-label">Years Expertise</div>
          </div>
          <div className="galaxy-divider"></div>
          <div className="galaxy-proof-item">
            <div className="galaxy-proof-num">Studio-Level</div>
            <div className="galaxy-proof-label">Execution</div>
          </div>
        </section>

        {/* WORK */}
        <section className="galaxy-work" id="workSection" data-testid="work-section">
          <div className="galaxy-section-header">
            <h2 className="galaxy-section-title" data-testid="work-title">Selected Work</h2>
            <p className="galaxy-section-sub">
              A refined selection of projects demonstrating strategic thinking, modern aesthetics, and meticulous execution.
            </p>
            <div className="galaxy-quote">Great brands are not accidental. They are designed.</div>
          </div>
          
          <div className="galaxy-work-grid">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="galaxy-project-card" 
                data-testid={`project-card-${index}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="galaxy-project-img">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="galaxy-project-overlay">
                    <span>View Project</span>
                  </div>
                </div>
                <div className="galaxy-project-info">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONING */}
        <section className="galaxy-positioning" data-testid="positioning-section">
          <h2 className="galaxy-section-title">Built for Brands That Intend to Lead</h2>
          <div className="galaxy-positioning-content">
            <p>We partner with ambitious businesses and emerging brands to craft visuals that influence perception and accelerate growth.</p>
            <p>Every detail is deliberate. Every design serves a purpose.</p>
            <p className="galaxy-closer">Not decoration. Direction.</p>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="galaxy-capabilities" data-testid="capabilities-section">
          <h2 className="galaxy-section-title">Capabilities</h2>
          <div className="galaxy-cap-grid">
            {[
              { title: 'Brand Identity', desc: 'Strategic visual systems designed for recognition and long-term brand equity.' },
              { title: 'Motion Design', desc: 'Cinematic visuals engineered to capture attention in fast-moving digital spaces.' },
              { title: 'Digital Creatives', desc: 'Modern, conversion-aware design tailored for today platforms.' },
              { title: 'Photo Manipulation', desc: 'High-detail compositions that transform concepts into powerful visuals.' }
            ].map((cap, i) => (
              <div key={i} className="galaxy-cap-item">
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER */}
        <section className="galaxy-founder" data-testid="founder-section">
          <div className="galaxy-founder-logo">
            <img 
              src="https://drive.google.com/uc?export=view&id=1sMjejBtmc5If2PABfdaWv35U3duIu57h" 
              alt="GFXTAB"
            />
          </div>
          <h2 className="galaxy-section-title">Founder-Led. Detail-Obsessed.</h2>
          <div className="galaxy-founder-content">
            <p>GFXTAB was founded by <strong>Taiyyab Saiyyad</strong>, a visual designer known for blending strategic clarity with striking aesthetics.</p>
            <p>With over four years of professional experience, his work reflects a commitment to precision, modern design language, and results-driven creativity.</p>
            <div className="galaxy-founder-quote">
              Good design attracts attention.<br/>
              Exceptional design earns trust.
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="galaxy-process" data-testid="process-section">
          <h2 className="galaxy-section-title">Process</h2>
          <div className="galaxy-process-grid">
            {[
              { num: '01', title: 'Discover', desc: 'Understanding your brand, audience, and objectives.' },
              { num: '02', title: 'Define', desc: 'Translating insights into clear creative direction.' },
              { num: '03', title: 'Design', desc: 'Crafting visuals with precision and intention.' },
              { num: '04', title: 'Refine', desc: 'Polishing every detail until it meets studio standards.' },
              { num: '05', title: 'Deliver', desc: 'Production-ready assets built for impact.' }
            ].map((step, i) => (
              <div key={i} className="galaxy-process-step">
                <div className="galaxy-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="galaxy-trust" data-testid="trust-section">
          <h2 className="galaxy-section-title">Building Long-Term Creative Partnerships</h2>
          <p className="galaxy-trust-text">
            Clients value GFXTAB for reliability, refined aesthetics, and a process that respects both timelines and quality.
          </p>
        </section>

        {/* PLATFORMS */}
        <section className="galaxy-platforms" data-testid="platforms-section">
          <h2 className="galaxy-section-title">Professional Platforms</h2>
          <div className="galaxy-platforms-grid">
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
                className="galaxy-platform-card"
                data-testid={platform.testid}
              >
                <div className="galaxy-platform-icon">{platform.icon}</div>
                <h3>{platform.name}</h3>
                <p>{platform.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="galaxy-cta" data-testid="final-cta">
          <h2 className="galaxy-cta-title">Let's Create Something Remarkable</h2>
          <p className="galaxy-cta-text">
            Whether you are launching a brand, elevating your presence, or redefining your visual identity, the right design can transform perception.
          </p>
          <p className="galaxy-cta-sub">Start the conversation.</p>
          <button 
            className="galaxy-btn-primary-large" 
            data-testid="start-project-btn-cta"
            onClick={() => setShowContactForm(true)}
          >
            Start a Project
          </button>
          <p className="galaxy-cta-notice">Currently accepting select projects.</p>
        </section>

        {/* FOOTER */}
        <footer className="galaxy-footer" data-testid="footer">
          <p>© 2025 GFXTAB — Crafted by Taiyyab Saiyyad</p>
          <p className="galaxy-footer-tag">Where visuals meet the cosmos.</p>
        </footer>
      </div>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="galaxy-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="galaxy-modal" onClick={(e) => e.stopPropagation()}>
            <button className="galaxy-modal-close" onClick={() => setSelectedProject(null)}>
              <span className="close-line close-line-1"></span>
              <span className="close-line close-line-2"></span>
            </button>
            <div className="galaxy-modal-img">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="galaxy-modal-details">
              <div>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.category}</p>
              </div>
              <a href={selectedProject.folder} target="_blank" rel="noopener noreferrer" className="galaxy-btn-small">
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
