;; Asteroid Mining Token Contract

(define-fungible-token asteroid-mining-token)

(define-data-var token-uri (string-utf8 256) u"https://example.com/metadata/asteroid-mining-token")

(define-constant contract-owner tx-sender)

(define-map asteroid-ownership
  { asteroid-id: uint }
  { owner: principal, shares: uint }
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ft-mint? asteroid-mining-token amount recipient)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (ft-transfer? asteroid-mining-token amount sender recipient)
  )
)

(define-public (acquire-asteroid-shares (asteroid-id uint) (shares uint))
  (let
    (
      (current-ownership (default-to { owner: tx-sender, shares: u0 } (map-get? asteroid-ownership { asteroid-id: asteroid-id })))
    )
    (asserts! (>= (ft-get-balance asteroid-mining-token tx-sender) shares) (err u401))
    (try! (ft-burn? asteroid-mining-token shares tx-sender))
    (ok (map-set asteroid-ownership
      { asteroid-id: asteroid-id }
      { owner: tx-sender, shares: (+ (get shares current-ownership) shares) }))
  )
)

(define-read-only (get-asteroid-ownership (asteroid-id uint))
  (map-get? asteroid-ownership { asteroid-id: asteroid-id })
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance asteroid-mining-token account))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ok (var-set token-uri new-uri))
  )
)

