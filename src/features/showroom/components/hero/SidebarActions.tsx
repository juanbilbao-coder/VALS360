import React from 'react';
import { Twitter, Instagram, Linkedin, Share2, MessageCircle } from 'lucide-react';

export default function SidebarActions() {
  return (
    <div className="right-sidebar__actions">
      <button className="sidebar-icon-btn" type="button" aria-label="Compartir">
        <Share2 className="w-4 h-4" />
      </button>
      <a className="sidebar-icon-btn" href="#" target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <MessageCircle className="w-4 h-4" />
      </a>
      <a href="#" className="sidebar-icon-btn" aria-label="Instagram">
        <Instagram className="w-4 h-4" />
      </a>
      <a href="#" className="sidebar-icon-btn" aria-label="Twitter">
        <Twitter className="w-4 h-4" />
      </a>
      <a href="#" className="sidebar-icon-btn" aria-label="LinkedIn">
        <Linkedin className="w-4 h-4" />
      </a>
    </div>
  );
}
