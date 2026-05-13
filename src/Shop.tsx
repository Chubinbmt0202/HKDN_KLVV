import React, { useState } from 'react';
import { DINO_PRICES, BG_PRICES } from './constants';

interface ShopProps {
  selectedDino: number;
  selectedBg: number;
  onSelect: (type: 'dino' | 'bg', id: number) => void;
  onBuy: (type: 'dino' | 'bg', id: number, price: number) => boolean;
  onClose: () => void;
  gold: number;
  ownedDinos: number[];
  ownedBgs: number[];
}

export function Shop({ selectedDino, selectedBg, onSelect, onBuy, onClose, gold, ownedDinos, ownedBgs }: ShopProps) {
  const [activeTab, setActiveTab] = useState<'dino' | 'bg'>('dino');
  const dinos = [1, 2, 3, 4];
  const bgs = [1, 2, 3, 4];

  const handleCardClick = (type: 'dino' | 'bg', id: number) => {
    const isOwned = type === 'dino' ? ownedDinos.includes(id) : ownedBgs.includes(id);
    if (isOwned) {
      onSelect(type, id);
    } else {
      const price = type === 'dino' ? DINO_PRICES[id] : BG_PRICES[id];
      if (gold >= price) {
        onBuy(type, id, price);
      }
    }
  };

  const renderDinos = () => (
    <div style={styles.grid}>
      {dinos.map(id => {
        const isOwned = ownedDinos.includes(id);
        const isSelected = selectedDino === id;
        const price = DINO_PRICES[id];
        const canAfford = gold >= price;

        return (
          <div
            key={id}
            style={{
              ...styles.card,
              borderColor: isSelected ? '#4CAF50' : isOwned ? '#535353' : '#ddd',
              backgroundColor: isSelected ? '#f0fff0' : isOwned ? '#f9f9f9' : '#fff',
              opacity: !isOwned && !canAfford ? 0.7 : 1
            }}
            onClick={() => handleCardClick('dino', id)}
          >
            <div style={styles.imageContainer}>
              <img
                src={`/assets/dino_sprites/dino_${id}.png`}
                alt={`Dino ${id}`}
                style={styles.sprite}
              />
            </div>
            <div style={styles.dinoName}>Mẫu {id}</div>
            {!isOwned && <div style={styles.priceTag}>🪙 {price}</div>}
            {isSelected && <div style={styles.selectedBadge}>Đang chọn</div>}
            {isOwned && !isSelected && <div style={styles.ownedBadge}>Đã có</div>}
          </div>
        );
      })}
    </div>
  );

  const getBgColor = (id: number) => {
    if (id === 1) return '#f7f7f7';
    if (id === 2) return '#1e1e24';
    if (id === 3) return '#ffdac1';
    if (id === 4) return '#e09f87';
    return '#fff';
  };

  const renderBgs = () => (
    <div style={styles.grid}>
      {bgs.map(id => {
        const isOwned = ownedBgs.includes(id);
        const isSelected = selectedBg === id;
        const price = BG_PRICES[id];
        const canAfford = gold >= price;

        return (
          <div
            key={id}
            style={{
              ...styles.card,
              borderColor: isSelected ? '#4CAF50' : isOwned ? '#535353' : '#ddd',
              backgroundColor: isSelected ? '#f0fff0' : isOwned ? '#f9f9f9' : '#fff',
              opacity: !isOwned && !canAfford ? 0.7 : 1
            }}
            onClick={() => handleCardClick('bg', id)}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '4px', marginBottom: '5px',
              backgroundColor: getBgColor(id), border: '1px solid #ccc'
            }} />
            <div style={styles.dinoName}>Nền {id}</div>
            {!isOwned && <div style={styles.priceTag}>🪙 {price}</div>}
            {isSelected && <div style={styles.selectedBadge}>Đang chọn</div>}
            {isOwned && !isSelected && <div style={styles.ownedBadge}>Đã có</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>CỬA HÀNG</h2>
        <div style={styles.goldDisplay}>🪙 Vàng hiện có: {gold}</div>

        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tabBtn, ...(activeTab === 'dino' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('dino')}
          >
            Khủng Long
          </button>
          <button 
            style={{...styles.tabBtn, ...(activeTab === 'bg' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('bg')}
          >
            Hình Nền
          </button>
        </div>

        {activeTab === 'dino' ? renderDinos() : renderBgs()}

        <button style={styles.closeButton} onClick={onClose}>
          ĐÓNG
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    width: '90%',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: '0 0 5px 0',
    fontFamily: 'monospace',
    fontSize: '18px',
    color: '#333',
  },
  goldDisplay: {
    fontFamily: 'monospace',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: '10px',
    backgroundColor: '#fffbe6',
    padding: '4px 12px',
    borderRadius: '12px',
    border: '1px solid #ffe58f'
  },
  tabContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: '15px',
    borderBottom: '2px solid #eee',
  },
  tabBtn: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#888',
    transition: 'color 0.2s',
  },
  activeTab: {
    color: '#4CAF50',
    borderBottom: '2px solid #4CAF50',
    marginBottom: '-2px', // overlap border
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    width: '100%',
    marginBottom: '15px',
  },
  card: {
    border: '2px solid',
    borderRadius: '8px',
    padding: '8px 4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'all 0.2s',
  },
  imageContainer: {
    width: '36px',
    height: '36px',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '5px',
  },
  sprite: {
    height: '100%',
    objectFit: 'none',
    objectPosition: '0 0',
    imageRendering: 'pixelated',
    transform: 'scale(1.5)',
    transformOrigin: 'top left',
  },
  dinoName: {
    fontFamily: 'monospace',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#535353',
  },
  priceTag: {
    fontFamily: 'monospace',
    fontSize: '9px',
    color: '#D4AF37',
    marginTop: '4px',
    fontWeight: 'bold',
  },
  selectedBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '1px 4px',
    borderRadius: '8px',
    fontSize: '8px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    zIndex: 1,
  },
  ownedBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#535353',
    color: 'white',
    padding: '1px 4px',
    borderRadius: '8px',
    fontSize: '8px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    zIndex: 1,
  },
  closeButton: {
    padding: '6px 20px',
    backgroundColor: '#535353',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

