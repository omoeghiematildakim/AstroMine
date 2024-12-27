;; Resource Market Contract

(define-map resource-prices
  { resource-id: uint }
  { price: uint }
)

(define-map resource-supply
  { resource-id: uint }
  { supply: uint }
)

(define-constant contract-owner tx-sender)

(define-public (update-resource-price (resource-id uint) (new-price uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ok (map-set resource-prices { resource-id: resource-id } { price: new-price }))
  )
)

(define-public (add-resource-supply (resource-id uint) (amount uint))
  (let
    (
      (current-supply (default-to { supply: u0 } (map-get? resource-supply { resource-id: resource-id })))
    )
    (ok (map-set resource-supply
      { resource-id: resource-id }
      { supply: (+ (get supply current-supply) amount) }))
  )
)

(define-public (remove-resource-supply (resource-id uint) (amount uint))
  (let
    (
      (current-supply (unwrap! (map-get? resource-supply { resource-id: resource-id }) (err u404)))
    )
    (asserts! (>= (get supply current-supply) amount) (err u401))
    (ok (map-set resource-supply
      { resource-id: resource-id }
      { supply: (- (get supply current-supply) amount) }))
  )
)

(define-read-only (get-resource-price (resource-id uint))
  (map-get? resource-prices { resource-id: resource-id })
)

(define-read-only (get-resource-supply (resource-id uint))
  (map-get? resource-supply { resource-id: resource-id })
)

