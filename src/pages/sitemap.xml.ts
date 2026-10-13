import type {APIRoute} from 'astro';
import {services,projects,url} from '../data';
export const GET:APIRoute=({site})=>{const paths=['','about/','services/','projects/','our-process/','testimonials/','service-areas/','contact/','privacy/',...services.map(s=>`services/${s.slug}/`),...projects.map(p=>`projects/${p.slug}/`)];return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${new URL(url(p),site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});};
