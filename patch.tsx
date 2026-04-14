          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <AtSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input 
                type="text" placeholder="Choose a Username" required
                value={username} onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%', padding: '16px 16px 16px 44px', boxSizing: 'border-box',
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none'
                }}
              />
            </div>
          )}
